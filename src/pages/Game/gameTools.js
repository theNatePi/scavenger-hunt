import { getItemsByPackId } from '../../utils/items/ItemData';
import { getPackImages } from '../../utils/imageStorage/firebaseStorage';

function _numTeamsFoundItem(itemId, game) {
  return game?.teams?.filter(
    (team) => team.foundItems.some((foundItem) => foundItem.id === itemId)
  ).length;
};

function _playerTeamFoundItem(itemId, game, team) {
  // return game?.teams?.find(
  //   (team) => team.foundItems.some((foundItem) => foundItem.itemId === itemId)
  // )?.id ?? false;
  return false;
};

async function fetchItems(packId) {
  const items = await getItemsByPackId(packId);
  const images = await getPackImages(packId);
  
  // Enrich items with image URLs
  return items.map((item) => {
    return {
      ...item,
      imageUrl: images.find((image) => image.path.includes(item.imageFile))?.url,
    };
  });
};

function enrichItems(items, game, team) {
  if (!items) {
    return [];
  }

  // Enrich items with foundByPlayerTeam and numTeamsFound
  return items.map((item) => {
    return {
      ...item,
      foundByPlayerTeam: _playerTeamFoundItem(item.id, game, team),
      numTeamsFound: _numTeamsFoundItem(item.id, game),
    };
  });
}

export { fetchItems, enrichItems };
