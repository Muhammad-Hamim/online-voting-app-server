export const getAllPositionsWithCandidatesAndWinnerQuery = [
  // Step 1: Lookup candidates for each position
  {
    $lookup: {
      from: "candidates",
      localField: "_id",
      foreignField: "position",
      as: "candidates",
    },
  },
  // Step 2: Unwind the candidates array
  {
    $unwind: {
      path: "$candidates",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Step 3: Lookup user details for each candidate
  {
    $lookup: {
      from: "users",
      localField: "candidates.candidate",
      foreignField: "_id",
      as: "userDetails",
    },
  },
  // Step 4: Combine candidate info with user details
  {
    $addFields: {
      "candidates.name": { $arrayElemAt: ["$userDetails.name", 0] },
      "candidates.email": { $arrayElemAt: ["$userDetails.email", 0] },
      "candidates.photo": { $arrayElemAt: ["$userDetails.photo", 0] },
      "candidates.studentId": { $arrayElemAt: ["$userDetails.studentId", 0] },
    },
  },
  // Step 5: Group back the candidates array
  {
    $group: {
      _id: "$_id",
      title: { $first: "$title" },
      description: { $first: "$description" },
      duration: { $first: "$duration" },
      creator: { $first: "$creator" },
      applicationDeadline: { $first: "$applicationDeadline" },
      status: { $first: "$status" },
      terminationMessage: { $first: "$terminationMessage" },
      maxVotes: { $first: "$maxVotes" },
      maxCandidate: { $first: "$maxCandidate" },
      isDeleted: { $first: "$isDeleted" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      candidates: { $push: "$candidates" },
    },
  },
  // Step 6: Determine the winner
  {
    $addFields: {
      winner: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$candidates",
              as: "candidate",
              cond: {
                $eq: ["$$candidate.votes", { $max: "$candidates.votes" }],
              },
            },
          },
          0,
        ],
      },
    },
  },
  // Step 7: Project the final result
  {
    $project: {
      title: 1,
      description: 1,
      creator: 1,
      status: 1,
      "candidates._id": 1,
      "candidates.email": 1,
      "candidates.studentId": 1,
      "candidates.votes": 1,
      "candidates.status": 1,
      "candidates.message": 1,
      "candidates.name": 1,
      "candidates.photo": 1,
      "winner._id": 1,
      "winner.email": 1,
      "winner.studentId": 1,
      "winner.status": 1,
      "winner.votes": 1,
      "winner.message": 1,
      "winner.name": 1,
      "winner.photo": 1,
    },
  },
];

export const getPositionsWithCandidatesAndVotersQuery = [
  {
    $addFields: {
      creatorObjectId: { $toObjectId: "$creator" }, // Convert creator string to ObjectId
    },
  },
  {
    $lookup: {
      from: "users", // Collection name for users (creator details)
      localField: "creatorObjectId",
      foreignField: "_id",
      as: "creator",
    },
  },
  {
    $unwind: {
      path: "$creator",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "candidates", // Collection name for candidates
      localField: "_id",
      foreignField: "position",
      as: "candidates",
    },
  },
  {
    $unwind: {
      path: "$candidates",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users", // Collection name for users (candidate details)
      localField: "candidates.candidate",
      foreignField: "_id",
      as: "candidates.userDetails",
    },
  },
  {
    $unwind: {
      path: "$candidates.userDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "votes", // Collection name for votes
      localField: "candidates._id",
      foreignField: "candidate",
      as: "candidates.voters",
    },
  },
  {
    $lookup: {
      from: "users", // Collection name for users (voter details)
      localField: "candidates.voters.voter",
      foreignField: "_id",
      as: "votersDetails",
    },
  },
  {
    $addFields: {
      "candidates.voters": {
        $map: {
          input: {
            $filter: {
              input: "$votersDetails",
              as: "voterDetail",
              cond: { $in: ["$$voterDetail._id", "$candidates.voters.voter"] },
            },
          },
          as: "voter",
          in: {
            _id: "$$voter._id",
            email: "$$voter.email",
            createdAt: { $first: "$candidates.voters.createdAt" },
            updatedAt: { $first: "$candidates.voters.updatedAt" },
            name: "$$voter.name",
            studentId: "$$voter.studentId",
            photo: "$$voter.photo",
          },
        },
      },
    },
  },
  {
    $group: {
      _id: "$_id",
      title: { $first: "$title" },
      description: { $first: "$description" },
      duration: { $first: "$duration" },
      startTime: { $first: "$startTime" },
      endTime: { $first: "$endTime" },
      status: { $first: "$status" },
      terminationMessage: { $first: "$terminationMessage" },
      maxVotes: { $first: "$maxVotes" },
      maxCandidate: { $first: "$maxCandidate" },
      isDeleted: { $first: "$isDeleted" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      creator: { $first: "$creator" },
      candidates: {
        $push: {
          _id: "$candidates._id",
          email: "$candidates.email",
          votes: "$candidates.votes",
          status: "$candidates.status",
          message: "$candidates.message",
          name: "$candidates.userDetails.name",
          photo: "$candidates.userDetails.photo",
          studentId: "$candidates.userDetails.studentId",
          voters: "$candidates.voters",
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      duration: 1,
      startTime: 1,
      endTime: 1,
      status: 1,
      terminationMessage: 1,
      maxVotes: 1,
      maxCandidate: 1,
      isDeleted: 1,
      createdAt: 1,
      updatedAt: 1,
      creator: {
        _id: "$creator._id",
        email: "$creator.email",
        name: "$creator.name",
        photo: "$creator.photo",
        studentId: "$creator.studentId",
      },
      candidates: 1,
    },
  },
];

export const getMyApplicationDetails = (email: string) => [
  // Match the candidate by email
  {
    $match: { email: email },
  },

  // Lookup and populate the position information
  {
    $lookup: {
      from: "positions", // collection name
      localField: "position",
      foreignField: "_id",
      as: "positionDetails",
    },
  },
  // Unwind the position array (since lookup returns an array)
  {
    $unwind: {
      path: "$positionDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      creatorObjectId: { $toObjectId: "$positionDetails.creator" }, // Convert creator string to ObjectId
    },
  },
  // Lookup creator details from the users collection
  {
    $lookup: {
      from: "users", // users collection
      localField: "creatorObjectId", // creator ID in the positions collection
      foreignField: "_id", // match with users
      as: "creator",
    },
  },
  // Unwind the creator details
  {
    $unwind: {
      path: "$creator",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Lookup voters from the votes collection based on the position ID
  {
    $lookup: {
      from: "votes", // votes collection
      let: { positionId: "$positionDetails._id", candidateId: "$_id" }, // Pass position ID and candidate ID to the lookup
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$position", "$$positionId"] }, // Match position ID
                { $eq: ["$candidate", "$$candidateId"] }, // Match candidate ID
              ],
            },
          },
        },
      ],
      as: "voterVotes",
    },
  },
  // Unwind the voters to join with the users collection
  {
    $unwind: {
      path: "$voterVotes",
      preserveNullAndEmptyArrays: true, // in case there are no voters
    },
  },
  // Lookup and populate voter information from the users collection
  {
    $lookup: {
      from: "users", // users collection
      localField: "voterVotes.voter", // voter IDs in the votes
      foreignField: "_id", // match with users
      as: "voterDetails",
    },
  },
  // Unwind the voter details
  {
    $unwind: {
      path: "$voterDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Group back the voters with their respective vote timestamps
  {
    $group: {
      _id: "$_id",
      email: { $first: "$email" },
      votes: { $first: "$votes" },
      status: { $first: "$status" },
      message: { $first: "$message" },
      createdAt: { $first: "$createdAt" },
      positionDetails: { $first: "$positionDetails" },
      creator: {
        $first: {
          _id: "$creator._id",
          name: "$creator.name",
          email: "$creator.email",
          studentId: "$creator.studentId",
          photo: "$creator.photo",
          status: "$creator.status",
        },
      },
      voters: {
        $push: {
          _id: "$voterDetails._id",
          name: "$voterDetails.name",
          email: "$voterDetails.email",
          studentId: "$voterDetails.studentId",
          photo: "$voterDetails.photo",
          status: "$voterDetails.status",
          createdAt: "$voterVotes.createdAt", // vote time
          updatedAt: "$voterVotes.updatedAt", // vote update time
        },
      },
    },
  },
  // Optionally, project the output to include only necessary fields
  {
    $project: {
      _id: 1,
      email: 1,
      votes: 1,
      status: 1,
      message: 1,
      createdAt: 1,
      positionDetails: 1,
      creator: 1, // Include only the specified fields for the creator
      voters: 1,
    },
  },
];
