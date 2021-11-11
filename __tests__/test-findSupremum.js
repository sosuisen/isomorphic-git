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
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '79bde7fec719bae4addc13f5dcef436e1aeb0573', // L
    })
    expect(base).toEqual('79bde7fec719bae4addc13f5dcef436e1aeb0573') // L
  })

  it('A child and its grand parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: 'fe1ec0cf4635d444ab8112ef22f9290434e321f1', // K
    })
    expect(base).toEqual('fe1ec0cf4635d444ab8112ef22f9290434e321f1') // K
  })

  it('A child and its direct ancestor who has two parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: 'ae1a5f2cd7f24c8d026c46337b3bf7cd345d2c41', // J
    })
    expect(base).toEqual('ae1a5f2cd7f24c8d026c46337b3bf7cd345d2c41') // J
  })

  it('A child and its branched first ancestor, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '6cbf80c18fa54cc8227adb392d850f579a7a2eb3', // I
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child and its branched second ancestor, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '48331c8a4044cf20dd58f2f5a38a4f1e0c3b3d9b', // H
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child and its branched first ancestor, a common parent has a parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '258657db62e704989e0f5d846705de7f8e218459', // G
      behindOid: '5ad83f5f265db4430dbe355683b82eea80e361a7', // E
    })
    expect(base).toEqual('30ee70896d0d377d6711488bdd5e115037f2b0f7') // B
  })

  it('A child and its another branched first ancestor, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '258657db62e704989e0f5d846705de7f8e218459', // G
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child and its sub-branched ancestor, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '5ad83f5f265db4430dbe355683b82eea80e361a7', // E
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child and its ancestor who is an end branch point, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '4013a8b4f7ba9ae9a975d206d1d8538511661e88', // F
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child and its ancestor who is a start branch point, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '7d9b3a17f592ad3fbaf19be0e9b7b716421db971', // M
      behindOid: '30ee70896d0d377d6711488bdd5e115037f2b0f7', // B
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child who is an end branch point and its ancestor who is a start branch point, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: 'ae1a5f2cd7f24c8d026c46337b3bf7cd345d2c41', // J
      behindOid: '30ee70896d0d377d6711488bdd5e115037f2b0f7', // B
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child who is a start branch point and its parent who is a root, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '30ee70896d0d377d6711488bdd5e115037f2b0f7', // B
      behindOid: 'f2a80819723d21c08c9bc01b2ff593d308f8f546', // A
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child who is an end branch point and its parent who is a root, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: 'ae1a5f2cd7f24c8d026c46337b3bf7cd345d2c41', // J
      behindOid: 'f2a80819723d21c08c9bc01b2ff593d308f8f546', // A
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child who is in the middle of branch and its ancestor who is a root, a common parent has no parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '4013a8b4f7ba9ae9a975d206d1d8538511661e88', // F
      behindOid: 'f2a80819723d21c08c9bc01b2ff593d308f8f546', // A
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })

  it('A child who is an end branch point and its ancestor who is a start branch point, a common parent has a parent', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '4013a8b4f7ba9ae9a975d206d1d8538511661e88', // F
      behindOid: '30ee70896d0d377d6711488bdd5e115037f2b0f7', // B
    })
    expect(base).toEqual('30ee70896d0d377d6711488bdd5e115037f2b0f7') // B
  })

  it('A child who is an end branch point and its branched ancestor whose branch is longer than another branch', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '4013a8b4f7ba9ae9a975d206d1d8538511661e88', // F
      behindOid: '3ad4237a564e9fc36d4b52271f7fde8420671f3e', // D
    })
    expect(base).toEqual('30ee70896d0d377d6711488bdd5e115037f2b0f7') // B
  })

  it('A child who is an end branch point and its branched ancestor whose branch is longer than another branch, a common parent is root', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: 'ae1a5f2cd7f24c8d026c46337b3bf7cd345d2c41', // J
      behindOid: '3ad4237a564e9fc36d4b52271f7fde8420671f3e', // D
    })
    expect(base).toEqual('f2a80819723d21c08c9bc01b2ff593d308f8f546') // A
  })
})

describe('findSupremum (2)', () => {
  it('The next parents are the same and a root', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum2')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '9c1d6231c0368a7ef1223288468d532ed7fe9b87', // D
      behindOid: '2780272e46be35cb4ba0ce7055a0621c3ca9e90b', // C
    })
    expect(base).toEqual('d2e8efb27766ff7c76b1f262f47928550168e7e5') // A
  })
})

describe('findSupremum (3)', () => {
  it('The next parents are the same and not a root', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum3')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '1256edf17c3ad70f621b01f233c0d63a8874c61f', // E
      behindOid: 'fb35bb4ab78dbb2ade2c9daed90f4de190cfa385', // D
    })
    expect(base).toEqual('2043b5eb1ea396c6e2a83644a7a1a5d6108b0d9a') // B
  })
})

describe('findSupremum (4)', () => {
  it('The next parent is only one and a visited branch point', async () => {
    // Setup
    const { fs, gitdir } = await makeFixture('test-findSupremum4')
    // Test
    const base = await findSupremum({
      fs,
      gitdir,
      aheadOid: '73ced871326c0e060d60192d0fee7ff468d36789', // E
      behindOid: 'b086577ad5022d6fc216a9ce5ad7c2addfc24ec8', // D
    })
    expect(base).toEqual('b13de7a1e6e969325b653287c4df40608e974cb2') // A
  })
})
