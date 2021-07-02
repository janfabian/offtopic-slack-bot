module.exports.PAYLOAD_TYPES = {
  MESSAGE_ACTION: "message_action",
  BLOCK_ACTIONS: "block_actions",
  VIEW_SUBMISSION: "view_submission",
};

module.exports.CALLBACK_IDS = {
  SETUP: "setup",
};

module.exports.BLOCK_IDS = {
  CHANNEL_SELECT: "channel-select",
};

module.exports.VIEWS = {
  [module.exports.CALLBACK_IDS.SETUP]: (triggerId) => ({
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: module.exports.CALLBACK_IDS.SETUP,
      title: {
        type: "plain_text",
        text: "Offtopic setup",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: module.exports.BLOCK_IDS.CHANNEL_SELECT,
          label: {
            type: "plain_text",
            text: "Select a channel to which will store the offtopic threads",
          },
          element: {
            type: "conversations_select",
            placeholder: {
              type: "plain_text",
              text: "Select conversations",
              emoji: true,
            },
            filter: {
              include: ["public"],
            },
            action_id: "multi_conversations_select-action",
          },
        },
      ],
    },
  }),
};
