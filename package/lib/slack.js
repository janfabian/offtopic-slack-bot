const { WebClient } = require("@slack/web-api");

module.exports.DEFAULT_APP_CONVERSATION_NAME = "offtopic-app-thread-storage";

module.exports.getClient = (token = process.env.SLACK_TOKEN) => {
  return new WebClient(token, {
    logLevel: process.env.NODE_ENV === "test" ? "error" : "warn",
  });
};

module.exports.findConversation = async (
  client = module.exports.getClient(),
  comparator = () => true,
  opts = {}
) => {
  for await (const page of client.paginate("conversations.list", {
    limit: 50,
    ...opts,
  })) {
    for (const channel of page.channels) {
      if (comparator(channel)) {
        return channel;
      }
    }
  }
};

module.exports.createThread = async (
  client = module.exports.getClient(),
  channelId,
  messageTs,
  offtopicChannelId
) => {
  const link = await client.chat.getPermalink({
    channel: channelId,
    message_ts: messageTs,
  });

  const thread = await client.chat.postMessage({
    channel: offtopicChannelId,
    text: "offtopic thread",
  });

  const header = await client.chat.postMessage({
    channel: offtopicChannelId,
    text: `<${link.permalink}|original message>`,
    thread_ts: thread.ts,
  });

  return {
    offtopic: {
      thread: thread,
      header: header,
    },
  };
};
