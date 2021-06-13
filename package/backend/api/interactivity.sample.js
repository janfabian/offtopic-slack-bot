// {
//   payload: {
//     type: "message_action",
//     token: "DnDKwHNP8AWLPohSPSsmuFcR",
//     action_ts: "1623507262.386829",
//     team: { id: "T022W258HAR", domain: "janfabian" },
//     user: {
//       id: "U022JB6SB55",
//       username: "jan.fabian",
//       team_id: "T022W258HAR",
//       name: "jan.fabian",
//     },
//     channel: { id: "C022Z4FQCQ2", name: "general" },
//     is_enterprise_install: false,
//     enterprise: null,
//     callback_id: "start-offtopic-thread",
//     trigger_id: "2189309407536.2098073289365.046d3020c9b05b99e9577f4aaec1e076",
//     response_url:
//       "https://hooks.slack.com/app/T022W258HAR/2171672650692/0jbnBzBa3UWZXogafByzILTo",
//     message_ts: "1623504298.000200",
//     message: {
//       client_msg_id: "56dc0984-3005-4721-8716-4a96a75f9cb8",
//       type: "message",
//       text: "bar",
//       user: "U022JB6SB55",
//       ts: "1623504298.000200",
//       team: "T022W258HAR",
//       blocks: [Array],
//     },
//   },
// };

module.exports.messageAction = {
  payload:
    '{"type":"message_action","token":"DnDKwHNP8AWLPohSPSsmuFcR","action_ts":"1623507262.386829","team":{"id":"T022W258HAR","domain":"janfabian"},"user":{"id":"U022JB6SB55","username":"jan.fabian","team_id":"T022W258HAR","name":"jan.fabian"},"channel":{"id":"C022Z4FQCQ2","name":"general"},"is_enterprise_install":false,"enterprise":null,"callback_id":"start-offtopic-thread","trigger_id":"2189309407536.2098073289365.046d3020c9b05b99e9577f4aaec1e076","response_url":"https:\\/\\/hooks.slack.com\\/app\\/T022W258HAR\\/2171672650692\\/0jbnBzBa3UWZXogafByzILTo","message_ts":"1623504298.000200","message":{"client_msg_id":"56dc0984-3005-4721-8716-4a96a75f9cb8","type":"message","text":"bar","user":"U022JB6SB55","ts":"1623504298.000200","team":"T022W258HAR","blocks":[{"type":"rich_text","block_id":"s3p","elements":[{"type":"rich_text_section","elements":[{"type":"text","text":"bar"}]}]}]}}',
};
