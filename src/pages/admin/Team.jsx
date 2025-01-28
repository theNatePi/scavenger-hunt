import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ComparisonCard }from '../../components/AdminComponents';
import { getTeamPhotos, getConfirmed } from '../../utils/db';

const AdminTeam = () => {
  const { id } = useParams();
  const [comparisons, setComparisons] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchTeamPhotos = async () => {
      const photos = await getTeamPhotos(id);
      const confirmedPoints = await getConfirmed(id);
      setComparisons(photos);
      setPoints(confirmedPoints);
    };

    fetchTeamPhotos();
  }, [id]);

  return (
    <div>
      AdminTeam - Team ID: {id}
      {comparisons.map((comparison, index) => (
        <ComparisonCard 
          key={index}
          leftImage={comparison.image} 
          rightImage={comparison.foundImageUrl}
          confirmed={comparison.confirmed}
          itemId={comparison.itemId}
          teamId={id}
        />
      ))}
    </div>
  );
};

export default AdminTeam;
