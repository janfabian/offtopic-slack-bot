module.exports.newInstallation = {
  Records: [
    {
      eventID: "0c9c969f698ce004ce3bfa2de807ec13",
      eventName: "INSERT",
      eventVersion: "1.1",
      eventSource: "aws:dynamodb",
      awsRegion: "eu-central-1",
      dynamodb: {
        ApproximateCreationDateTime: 1625579422,
        Keys: {
          teamId: {
            S: "T022W258HAR",
          },
        },
        NewImage: {
          teamId: {
            S: "T022W258HAR",
          },
          botId: {
            S: "U022ZM8GYS1",
          },
          accessToken: {
            S: "accessToken",
          },
        },
        SequenceNumber: "103713900000000011611161998",
        SizeBytes: 119,
        StreamViewType: "NEW_IMAGE",
      },
      eventSourceARN:
        "arn:aws:dynamodb:eu-central-1:585648147442:table/offtopic-slack-bot-development.WorkspaceInstallations-9d06ef6/stream/2021-07-06T09:47:42.879",
    },
  ],
};
