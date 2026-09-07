import * as migration_20260808_023123_initial_migration from './20260808_023123_initial_migration';
import * as migration_20260812_231537_add_map_locations from './20260812_231537_add_map_locations';
import * as migration_20260907_133108_add_site_content_globals from './20260907_133108_add_site_content_globals';

export const migrations = [
  {
    up: migration_20260808_023123_initial_migration.up,
    down: migration_20260808_023123_initial_migration.down,
    name: '20260808_023123_initial_migration',
  },
  {
    up: migration_20260812_231537_add_map_locations.up,
    down: migration_20260812_231537_add_map_locations.down,
    name: '20260812_231537_add_map_locations',
  },
  {
    up: migration_20260907_133108_add_site_content_globals.up,
    down: migration_20260907_133108_add_site_content_globals.down,
    name: '20260907_133108_add_site_content_globals'
  },
];
