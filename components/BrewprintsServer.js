import { getBrewprints } from '@/lib/brewprints';
import BrewprintsClient from './BrewprintsClient';

export default async function BrewprintsServer() {
  const response = await getBrewprints();
  const validData = response.filter(item => item.data !== undefined);
  const brewprintsData = validData.map(item => item.data);

  return <BrewprintsClient initialBrewprints={brewprintsData} />;
}
