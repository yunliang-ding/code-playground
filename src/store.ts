import { create } from 'lyr-store';

export default create<{
  reactChange: boolean;
}>({
  reactChange: false,
});
