import { useParams } from 'react-router-dom';

export default function GameItem() {
  const { id } = useParams();

  return (
    <div>
      <h1>Game Item {id}</h1>
    </div>
  );
}
