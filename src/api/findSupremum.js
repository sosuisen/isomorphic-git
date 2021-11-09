// @ts-check
import '../typedefs.js'

import { _findSupremum } from '../commands/findSupremum.js'
import { FileSystem } from '../models/FileSystem.js'
import { assertParameter } from '../utils/assertParameter.js'
import { join } from '../utils/join.js'

/**
 * Find supremum for a set of commits
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string[]} args.oids - Which commits
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 */
export async function findSupremum({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oids,
  cache = {},
}) {
  try {
    assertParameter('fs', fs)
    assertParameter('gitdir', gitdir)
    assertParameter('oids', oids)

    return await _findSupremum({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oids,
    })
  } catch (err) {
    err.caller = 'git.findSupremum'
    throw err
  }
}
