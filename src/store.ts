import { createStore } from '@yl-d/components';

export default createStore<{
  reactChange: boolean;
}>({
  reactChange: false,
});
