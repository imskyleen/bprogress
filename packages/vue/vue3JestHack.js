import { registerTS } from '@vue/compiler-sfc';
import * as ts from 'typescript';

registerTS(() => ts);

import vueJest from '@vue/vue3-jest';
export default vueJest;
