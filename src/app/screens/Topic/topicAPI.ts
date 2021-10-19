// A mock function to mimic making an async request for data
export function fetchTopicAndOptions(topicId: string) {
  if (topicId === 'beach') {
    return new Promise<{ data: any }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: {
              topic: {
                topicId: 'beach',
                topicTextGeneric: 'What to bring',
                topicText: 'to the beach',
              },
              options: [
                {
                  optionId: 0,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 1,
                  link: '#',
                },
                {
                  optionId: 1,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 2,
                },
                {
                  optionId: 2,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 3,
                },
                {
                  optionId: 3,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 4,
                },
                {
                  optionId: 4,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 5,
                },
                {
                  optionId: 5,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 6,
                },
                {
                  optionId: 6,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 7,
                },
                {
                  optionId: 7,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 8,
                },
                {
                  optionId: 8,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 9,
                },
                {
                  optionId: 9,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 10,
                },
                {
                  optionId: 10,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 11,
                },
                {
                  optionId: 11,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 12,
                },
                {
                  optionId: 12,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 13,
                },
                {
                  optionId: 13,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 14,
                },
                {
                  optionId: 14,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 15,
                },
                {
                  optionId: 15,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 16,
                },
                {
                  optionId: 16,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 17,
                },
                {
                  optionId: 17,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 18,
                },
                {
                  optionId: 18,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 19,
                },
                {
                  optionId: 19,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 20,
                },
              ],
              total: 100,
            },
          }),
        500
      )
    );
  } else {
    return new Promise<{ data: any }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: {
              topic: {
                topicId: 'surfing',
                topicTextGeneric: 'What to bring',
                topicText: 'surfing',
              },
              options: [
                {
                  optionId: 0,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 1,
                  link: '#',
                },
                {
                  optionId: 1,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 2,
                },
                {
                  optionId: 2,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 3,
                },
                {
                  optionId: 3,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 4,
                },
                {
                  optionId: 4,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 3,
                  rank: 5,
                },
                {
                  optionId: 5,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 6,
                },
                {
                  optionId: 6,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 7,
                },
                {
                  optionId: 7,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 8,
                },
                {
                  optionId: 8,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 9,
                },
                {
                  optionId: 9,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 10,
                },
                {
                  optionId: 10,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 11,
                },
                {
                  optionId: 11,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 12,
                },
                {
                  optionId: 12,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 13,
                },
                {
                  optionId: 13,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 14,
                },
                {
                  optionId: 14,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 15,
                },
                {
                  optionId: 15,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 16,
                },
                {
                  optionId: 16,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 17,
                },
                {
                  optionId: 17,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 18,
                },
                {
                  optionId: 18,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 19,
                },
                {
                  optionId: 19,
                  topicId: 'beach',
                  optionText: 'Sandals',
                  upvotes: 10,
                  downvotes: 0,
                  rank: 20,
                },
              ],
            },
          }),
        500
      )
    );
  }
}
// A mock function to mimic making an async request for data
export function fetchMoreOptions(topicId: string, offset: number) {
  return new Promise<{ data: any }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: {
            options: [
              {
                optionId: 0,
                topicId: 'beach',
                optionText: 'Sunglasses',
                upvotes: 10,
                downvotes: 0,
                rank: 1,
                link: '#',
              },
              {
                optionId: 1,
                topicId: 'beach',
                optionText: 'Sunglasses',
                upvotes: 10,
                downvotes: 0,
                rank: 2,
              },
              {
                optionId: 2,
                topicId: 'beach',
                optionText: 'Sunglasses',
                upvotes: 10,
                downvotes: 0,
                rank: 3,
              },
              {
                optionId: 3,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 4,
              },
              {
                optionId: 4,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 5,
              },
              {
                optionId: 5,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 6,
              },
              {
                optionId: 6,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 7,
              },
              {
                optionId: 7,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 8,
              },
              {
                optionId: 8,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 9,
              },
              {
                optionId: 9,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 10,
              },
              {
                optionId: 10,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 11,
              },
              {
                optionId: 11,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 12,
              },
              {
                optionId: 12,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 13,
              },
              {
                optionId: 13,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 14,
              },
              {
                optionId: 14,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 15,
              },
              {
                optionId: 15,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 16,
              },
              {
                optionId: 16,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 17,
              },
              {
                optionId: 17,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 18,
              },
              {
                optionId: 18,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 19,
              },
              {
                optionId: 19,
                topicId: 'beach',
                optionText: 'Sandals',
                upvotes: 10,
                downvotes: 0,
                rank: 20,
              },
            ],
            total: 100,
          },
        }),
      500
    )
  );
}

export function fetchUserVotes(topicId: string, offset: number) {
  return new Promise<{ data: any }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: { upvotes: [2, 3, 6], downvotes: [4, 5, 10] },
        }),
      500
    )
  );
}
export function setUserDownvote(optionId: number) {
  return new Promise<{ isChange: any }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          isChange: true,
        }),
      500
    )
  );
}
export function setUserUpvote(optionId: number) {
  return new Promise<{ isChange: any }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          isChange: true,
        }),
      500
    )
  );
}
