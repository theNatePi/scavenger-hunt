
function _shuffle(array) {
  // Use Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function createTeams(playerIds, teamSize=undefined, numTeams=undefined) {
  if (teamSize && numTeams) {
    throw new Error('Cannot specify both teamSize and numTeams');
  }
  if (teamSize === undefined && numTeams === undefined) {
    throw new Error('Must specify either teamSize or numTeams');
  }

  if (numTeams === undefined) {
    // round to nearest integer
    numTeams = Math.round(playerIds.length / teamSize);
  }

  // Shuffle playerIds
  playerIds = _shuffle(playerIds);

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
  console.log(teams);
  return teams;
}

export { createTeams };
