/* eslint-env node, browser, jasmine */
const { findSupremum } = require('isomorphic-git')

const { makeFixture } = require('./__helpers__/FixtureFS.js')

describe('findSupremum', () => {
  it('A child and its parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      oids: [
        '183d2262080c40a0eac958989d7400999a9c76e9', // K
        '890406dc557a9d1ec797b3ba146ce4e92700c854', // J
      ],
    })
    expect(base).toEqual(['890406dc557a9d1ec797b3ba146ce4e92700c854']) // J
  })
})
