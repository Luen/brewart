import { getBrewprints } from '@/lib/brewprints';
import BrewprintsClient from './BrewprintsClient';

export default async function BrewprintsServer() {
  const response = await getBrewprints();
  const brewprintsData = response.map(item => item.data).filter(item => item.name !== "");

  return <BrewprintsClient initialBrewprints={brewprintsData} />;
}
