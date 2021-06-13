const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

module.exports.createThread = async (
  channelId,
  messageTs,
  offtopicChannelId
) => {
  const link = await web.chat.getPermalink({
    channel: channelId,
    message_ts: messageTs,
  });

  const thread = await web.chat.postMessage({
    channel: offtopicChannelId,
    text: "offtopic thread",
  });

  const header = await web.chat.postMessage({
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
