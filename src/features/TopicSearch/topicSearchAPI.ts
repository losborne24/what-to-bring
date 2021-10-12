// A mock function to mimic making an async request for data
export function fetchFilterTopics(filterText: string) {
  return new Promise<{ data: any }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: [
            {
              topicId: 'beach',
              topicTextGeneric: 'What to bring to',
              topicText: 'the beach',
            },
            {
              topicId: 'surfing',
              topicTextGeneric: 'What to bring',
              topicText: 'surfing',
            },
          ],
        }),
      500
    )
  );
}
