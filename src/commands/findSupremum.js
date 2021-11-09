// @ts-check
import { GitCommit } from '../models/GitCommit.js'
import { _readObject as readObject } from '../storage/readObject.js'

/**
 * Find a supuremum common parent of ahead commit and behind commit
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
  const visited = {}
  const parentChildrenMap = new Map()
  const branchPoints = {}
  let lastBranchPoint = ''

  branchPoints[behindOid] = true

  /**
   * @param {string[]} commits
   */
  async function _goBackCommitTree(commits) {
    try {
      const next = []
      for (const oid of commits) {
        // console.log('oid: ' + oid)

        if (oid === behindOid) behindCommitVisited = true

        if (visited[oid]) {
          branchPoints[oid] = true
          lastBranchPoint = oid
          continue
        }
        visited[oid] = true

        const { object } = await readObject({ fs, cache, gitdir, oid })
        const commit = GitCommit.from(object)
        const { parent } = commit.parseHeaders()

        if (parent !== undefined) {
          parent.forEach(p => {
            const children = parentChildrenMap.get(p)
            if (children === undefined) {
              parentChildrenMap.set(p, [oid])
            } else {
              children.push(oid)
            }
          })
          next.push(...parent)
        }
      }
      // console.log('next: ' + JSON.stringify(next))

      let prevChildren = ''
      let nextParentHasSameChildren = true
      for (const parent of next) {
        const children = JSON.stringify(parentChildrenMap.get(parent))
        // console.log(prevChildren + ',' + children)
        if (prevChildren === '') prevChildren = children
        else if (prevChildren !== children) nextParentHasSameChildren = false
      }

      if (behindCommitVisited && next.length === 0) return lastBranchPoint

      if (
        behindCommitVisited &&
        (next.length <= 1 || nextParentHasSameChildren)
      ) {
        // Start backtrack
        let backtrackCommit = next[0]
        while (backtrackCommit) {
          if (branchPoints[backtrackCommit]) {
            return backtrackCommit
          }
          // backtrack next
          const children = parentChildrenMap.get(backtrackCommit)
          // children is not undefined if it works normally
          if (children === undefined) return undefined
          else backtrackCommit = children[0] // Either children[0] or children[1] is OK when children.length is 2.
        }
      } else if (next.length !== 0) {
        return _goBackCommitTree(next)
      }
    } catch (err) {
      // do nothing
    }
    return undefined // Error
  }
  const { object } = await readObject({ fs, cache, gitdir, oid: aheadOid })
  const commit = GitCommit.from(object)
  const { parent } = commit.parseHeaders()
  if (parent === undefined || parent.length === 0) return aheadOid

  if (parent.length === 1 && parent[0] === behindOid) return behindOid

  return await _goBackCommitTree(parent)
}
