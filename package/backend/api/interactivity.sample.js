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

module.exports.TEAM_ID = "T022W258HAR";
module.exports.MESSAGE_TS = "1623504298.000200";

module.exports.messageAction = {
  payload:
    '{"type":"message_action","token":"DnDKwHNP8AWLPohSPSsmuFcR","action_ts":"1623507262.386829","team":{"id":"T022W258HAR","domain":"janfabian"},"user":{"id":"U022JB6SB55","username":"jan.fabian","team_id":"T022W258HAR","name":"jan.fabian"},"channel":{"id":"C022Z4FQCQ2","name":"general"},"is_enterprise_install":false,"enterprise":null,"callback_id":"start-offtopic-thread","trigger_id":"2189309407536.2098073289365.046d3020c9b05b99e9577f4aaec1e076","response_url":"https:\\/\\/hooks.slack.com\\/app\\/T022W258HAR\\/2171672650692\\/0jbnBzBa3UWZXogafByzILTo","message_ts":"1623504298.000200","message":{"client_msg_id":"56dc0984-3005-4721-8716-4a96a75f9cb8","type":"message","text":"bar","user":"U022JB6SB55","ts":"1623504298.000200","team":"T022W258HAR","blocks":[{"type":"rich_text","block_id":"s3p","elements":[{"type":"rich_text_section","elements":[{"type":"text","text":"bar"}]}]}]}}',
};

module.exports.viewSubmission = {
  payload:
    '{"type":"view_submission","team":{"id":"T022W258HAR","domain":"janfabian"},"user":{"id":"U022JB6SB55","username":"jan.fabian","name":"jan.fabian","team_id":"T022W258HAR"},"api_app_id":"A022XD0D7LM","token":"DnDKwHNP8AWLPohSPSsmuFcR","trigger_id":"2199590171872.2098073289365.6f2d43c76092763f97b233c7fe2703a3","view":{"id":"V0255P54LNN","team_id":"T022W258HAR","type":"modal","blocks":[{"type":"input","block_id":"channel-select","label":{"type":"plain_text","text":"Select a channel to which will store the offtopic threads","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"conversations_select","action_id":"multi_conversations_select-action","placeholder":{"type":"plain_text","text":"Select conversations","emoji":true},"filter":{"include":["public"]}}}],"private_metadata":"","callback_id":"setup","state":{"values":{"channel-select":{"multi_conversations_select-action":{"type":"conversations_select","selected_conversation":"C023BNKU9FB"}}}},"hash":"1623796273.Ib4xEX6B","title":{"type":"plain_text","text":"Offtopic setup","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0255P54LNN","app_id":"A022XD0D7LM","external_id":"","app_installed_team_id":"T022W258HAR","bot_id":"B0232PJUUGJ"},"response_urls":[],"is_enterprise_install":false,"enterprise":null}',
};
