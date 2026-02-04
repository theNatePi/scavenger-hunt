import { getItemsByPackId } from '../items/ItemData';



function _getItemFromTeamFoundItems(team, itemId) {
  const foundItems = team.foundItems;
  for (const foundItem of foundItems) {
    if (foundItem.id === itemId) {
      return foundItem;
    }
  }
  return null;
}


function _findFirstTeamToFindItem(itemId, game, bonusPoints, foundFirst) {
  const currentFoundAt = foundFirst[itemId]?.foundAt ?? Infinity;

  const teams = game.teams;
  for (const team of teams) {
    const foundItem = _getItemFromTeamFoundItems(team, itemId);
    if (foundItem && foundItem.foundAt < currentFoundAt && foundItem.verified) {
      foundFirst[itemId] = { teamId: team.id, foundAt: foundItem.foundAt, bonusPoints: bonusPoints };
    }
  }
  return foundFirst;
}



function _calculateTeamPoints(team, items) {
  let teamPoints = 0;
  for (const item of items) {
    const foundItem = team.foundItems.find((foundItem) => foundItem.id === item.id);
    if (foundItem && foundItem.verified) {
      teamPoints += item.points;
    }
  }
  return teamPoints;
}


async function calculateAllTeamPoints(game) {
  const teams = game.teams;
  const items = await getItemsByPackId(game.packId);

  // Find who found each item first
  let foundFirst = {};
  /* map itemId: {teamId, foundAt, bonusPoints} */

  for (const item of items) {
    foundFirst = await _findFirstTeamToFindItem(item.id, game, item.bonusPoints, foundFirst);
  }

  // Initialize the verified team points
  const verifiedTeamPoints = {};
  for (const team of teams) {
    verifiedTeamPoints[team.id] = 0;
  }

  // Add the bonus points
  for (const foundFirstItem of Object.values(foundFirst)) {
    verifiedTeamPoints[foundFirstItem.teamId] += foundFirstItem.bonusPoints;
  }

  // Calculate points for each team
  for (const team of teams) {
    const teamPoints = await _calculateTeamPoints(team, items, foundFirst);
    verifiedTeamPoints[team.id] += teamPoints;
  }

  return verifiedTeamPoints;
}

export { calculateAllTeamPoints };
