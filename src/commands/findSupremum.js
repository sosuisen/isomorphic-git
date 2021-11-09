// @ts-check
import { GitCommit } from '../models/GitCommit.js'
import { _readObject as readObject } from '../storage/readObject.js'

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.aheadOid
 * @param {string} args.behindOid
 */
export async function _findSupremum({
  fs,
  cache,
  gitdir,
  aheadOid,
  behindOid,
}) {
  if (aheadOid === behindOid) return aheadOid

  let behindCommitVisited = false
  const visited = []
  /**
   * @param {string[]} commits
   */
  async function _visitParents(commits) {
    try {
      const next = []
      let branches = 1
      for (const oid of commits) {
        if (oid === behindOid) behindCommitVisited = true
        visited.push(oid)
        const { object } = await readObject({ fs, cache, gitdir, oid })
        const commit = GitCommit.from(object)
        const { parent } = commit.parseHeaders()
        branches += parent.length - 1
        for (const p of parent) {
          if (visited.includes(p)) branches--
          else if ()
          next.push(p)
        }
      }



      if (behindCommitVisited && branches === 1)
      if (next.length !== 0) _visitParents(next)
    } catch (err) {
      // do nothing
    }
  }
  const { object } = await readObject({ fs, cache, gitdir, oid: aheadOid })
  const commit = GitCommit.from(object)
  const { parent } = commit.parseHeaders()
  if (parent.length === 0) return aheadOid

  await _visitParents(parent)

  /*
  const visits = {}
  const passes = oids.length
  let heads = oids.map((oid, index) => ({ index, oid }))
  while (heads.length) {
    // Count how many times we've passed each commit
    const result = new Set()
    for (const { oid, index } of heads) {
      if (!visits[oid]) visits[oid] = new Set()
      visits[oid].add(index)
      if (visits[oid].size === passes) {
        result.add(oid)
      }
    }
    if (result.size > 0) {
      return [...result]
    }
    // We haven't found a common ancestor yet
    const newheads = new Map()
    for (const { oid, index } of heads) {
      try {
        const { object } = await readObject({ fs, cache, gitdir, oid })
        const commit = GitCommit.from(object)
        const { parent } = commit.parseHeaders()
        for (const oid of parent) {
          if (!visits[oid] || !visits[oid].has(index)) {
            newheads.set(oid + ':' + index, { oid, index })
          }
        }
      } catch (err) {
        // do nothing
      }
    }
    heads = Array.from(newheads.values())
  } */
  return []
}
