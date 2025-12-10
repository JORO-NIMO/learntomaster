import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { enqueueAttempt, getAllQueued, clearQueueItem, clearAllQueue } from './offline'
import type { QueueRecord } from '@/types'

describe('offline queue', () => {
  beforeEach(async () => {
    await clearAllQueue()
  })

  it('enqueues and lists records', async () => {
    const rec: QueueRecord = {
      client_id: 'test-1',
      type: 'assessment_attempt',
      payload: { lin: 'L001', lessonId: 'lesson-1', score: 10, total: 20 },
      created_at: new Date().toISOString(),
    }
    await enqueueAttempt(rec)
    const all = await getAllQueued()
    expect(all.length).toBe(1)
    expect(all[0].client_id).toBe('test-1')
  })

  it('clears a queued record', async () => {
    const rec: QueueRecord = {
      client_id: 'test-2',
      type: 'assessment_attempt',
      payload: { lin: 'L001', lessonId: 'lesson-2', score: 18, total: 20 },
      created_at: new Date().toISOString(),
    }
    await enqueueAttempt(rec)
    let all = await getAllQueued()
    expect(all.find(r => r.client_id === 'test-2')).toBeTruthy()
    await clearQueueItem('test-2')
    all = await getAllQueued()
    expect(all.find(r => r.client_id === 'test-2')).toBeFalsy()
  })
})
