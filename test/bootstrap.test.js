/* eslint-disable */

import path from 'path'
import chai from 'chai'
import mongoose from 'mongoose'
import * as mongoMem from './utils/mongodb-mem-server'
import * as fixtures from './utils/dataHook'
import request from 'supertest'
import dirtyChai from 'dirty-chai'

let app
chai.use(dirtyChai)
const refreshDatabase = async done => {
  const fixture_dir = path.resolve('test/fixtures')
  if (fixture_dir) {
    const result = await fixtures.getAllFileInDir('test/fixtures')
    await Promise.all(
      result.map(async file => {
        const relativePath = path.relative('test', file)
        const data = require(`./${relativePath}`)
        await fixtures.loadObject(data)
      })
    )
  }
  done()
}

before(done => {
  boot(done)
})

beforeEach(done => {
  refreshDatabase(done)
})

afterEach(done => {
  done()
})

const boot = async done => {
  const {uri} = await mongoMem.boot()
  process.env.MONGO_URI = uri

  app = require('../src/index')
  console.log(`http://localhost:${process.env.PORT}`, 'URL')
  chai.sendLocalRequest = token =>
    request(`http://localhost:${process.env.PORT}`)
  mongoose.connection.on('connected', async () => {
    await mongoose.connection.db.dropDatabase()
    await refreshDatabase(done)
  })
}
