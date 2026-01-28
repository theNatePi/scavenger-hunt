import { shuffle } from "../tools";

function createTeams(playerIds, teamSize=undefined, numTeams=undefined) {
  if (teamSize && numTeams) {
    throw new Error('Cannot specify both teamSize and numTeams');
  }
  if (teamSize === undefined && numTeams === undefined) {
    throw new Error('Must specify either teamSize or numTeams');
  }
  if (playerIds.length < 4) {
    throw new Error('Must have at least 4 players');
  }

  if (numTeams === undefined) {
    // round to nearest integer
    numTeams = Math.round(playerIds.length / Number(teamSize));
  } else {
    numTeams = Number(numTeams);
  }

  // Shuffle playerIds
  playerIds = shuffle(playerIds);

  const teams = [];
  let teamIndex = 0;
  for (const playerId of playerIds) {
    if (teamIndex === numTeams) {
      teamIndex = 0;
    }
    if (teams[teamIndex] === undefined) {
      teams[teamIndex] = [];
    }

    teams[teamIndex].push(playerId);
    teamIndex++;
  }

  console.log(numTeams);
  console.log(teams);

  for (const team of teams) {
    if (team.length <= 1) {
      throw new Error('Your values produce teams which are too small');
    }
  }

  if (teams.length <= 1) {
    throw new Error('Your values produce <= 1 team');
  }

  return teams;
}

export { createTeams };
