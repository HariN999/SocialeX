import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { verifyToken } from './middleware/auth.js';
import Post from './models/Post.js';
import Chats from './models/Chats.js';
import User from './models/Users.js';
import SocketHandler from './SocketHandler.js';

// Setup environment mock
process.env.JWT_SECRET = 'test_secret_key';

console.log('--- STARTING SOCIALEX SECURITY ASSERTIONS ---');

// Mock User DB lookup
const mockUser = {
  _id: 'alice_id_123',
  username: 'alice',
  profilePic: 'alice_avatar'
};
User.findById = async (id) => {
  if (id === 'alice_id_123') return mockUser;
  return null;
};

// ==========================================
// 1. REST verifyToken Tests
// ==========================================
async function testRESTAuth() {
  console.log('Testing REST authentication boundaries...');

  // Test Case 1: Missing JWT
  let resStatus = null;
  let resJson = null;
  const mockRes = {
    status(code) {
      resStatus = code;
      return {
        json(data) {
          resJson = data;
        }
      };
    }
  };

  const reqMissing = {
    header() {
      return null;
    }
  };

  await verifyToken(reqMissing, mockRes, () => {
    assert.fail('Should not pass with missing token');
  });
  assert.strictEqual(resStatus, 401);
  assert.strictEqual(resJson.message, 'Authentication required');

  // Test Case 2: Invalid JWT
  const reqInvalid = {
    header(name) {
      if (name === 'Authorization') return 'Bearer invalid_token';
      return null;
    }
  };

  await verifyToken(reqInvalid, mockRes, () => {
    assert.fail('Should not pass with invalid token');
  });
  assert.strictEqual(resStatus, 401);
  assert.strictEqual(resJson.error, 'Invalid token');

  // Test Case 3: Authenticated Request
  const validToken = jwt.sign({ id: 'alice_id_123' }, process.env.JWT_SECRET);
  const reqValid = {
    header(name) {
      if (name === 'Authorization') return `Bearer ${validToken}`;
      return null;
    }
  };

  let nextCalled = false;
  await verifyToken(reqValid, mockRes, () => {
    nextCalled = true;
  });
  assert.strictEqual(nextCalled, true);
  assert.deepStrictEqual(reqValid.user, mockUser);

  console.log('✓ REST authentication boundaries secure.');
}

// ==========================================
// 2. Socket.IO Handshake & Event Verification
// ==========================================
async function testSocketSecurity() {
  console.log('Testing Socket.IO identity enforcement and BOLA boundaries...');

  // Capture event callbacks
  const eventRegistry = {};
  let emittedErrors = [];
  let emittedAuthErrors = [];
  let emittedSuccess = [];

  const mockSocket = {
    user: { id: 'alice_id_123' },
    on(event, callback) {
      eventRegistry[event] = callback;
    },
    emit(event, data) {
      if (event === 'error') emittedErrors.push(data);
      if (event === 'authorization-error') emittedAuthErrors.push(data);
      if (event === 'post-deleted' || event === 'messages-updated') emittedSuccess.push({ event, data });
    },
    join(room) {
      // Mock join
    }
  };

  // Instantiate handlers
  SocketHandler(mockSocket);

  // Test Case 1: delete-post (BOLA Case: Alice deleting Bob's post)
  const mockPostBob = {
    _id: 'post_bob_999',
    userId: 'bob_id_456'
  };

  Post.findById = async (id) => {
    if (id === 'post_bob_999') return mockPostBob;
    return null;
  };

  // Alice invokes delete-post targeting Bob's post
  emittedAuthErrors = [];
  await eventRegistry['delete-post']({ postId: 'post_bob_999' });
  assert.strictEqual(emittedAuthErrors.length, 1);
  assert.strictEqual(emittedAuthErrors[0].message, 'Unauthorized to delete this post');

  // Test Case 2: delete-post (Success Case: Alice deleting Alice's post)
  const mockPostAlice = {
    _id: 'post_alice_111',
    userId: 'alice_id_123'
  };
  Post.findById = async (id) => {
    if (id === 'post_alice_111') return mockPostAlice;
    return null;
  };
  Post.deleteOne = async () => {};
  Post.find = async () => [];

  emittedAuthErrors = [];
  emittedSuccess = [];
  await eventRegistry['delete-post']({ postId: 'post_alice_111' });
  assert.strictEqual(emittedAuthErrors.length, 0);
  assert.strictEqual(emittedSuccess.length, 1);
  assert.strictEqual(emittedSuccess[0].event, 'post-deleted');

  // Test Case 3: Chat Membership (BOLA Case: Alice fetching Bob/Charlie chat)
  // Chat ID is the concatenation of Bob and Charlie IDs.
  const bobId = 'bob000000000000000000000';
  const charlieId = 'charlie00000000000000000';
  const bobCharlieChatId = bobId + charlieId; // 48 chars

  Chats.findById = async (id) => {
    if (id === bobCharlieChatId) {
      return { _id: bobCharlieChatId, messages: [] };
    }
    return null;
  };

  emittedAuthErrors = [];
  await eventRegistry['fetch-messages']({ chatId: bobCharlieChatId });
  assert.strictEqual(emittedAuthErrors.length, 1);
  assert.strictEqual(emittedAuthErrors[0].message, 'Access denied to this conversation');

  // Test Case 4: Chat Membership (Success Case: Alice fetching Alice/Bob chat)
  const aliceBobChatId = 'alice_id_123'.padEnd(24, '0') + 'bob_id_456'.padEnd(24, '0');
  Chats.findById = async (id) => {
    if (id === aliceBobChatId) {
      return { _id: aliceBobChatId, messages: [] };
    }
    return null;
  };

  emittedAuthErrors = [];
  emittedSuccess = [];
  await eventRegistry['fetch-messages']({ chatId: aliceBobChatId });
  assert.strictEqual(emittedAuthErrors.length, 0);
  assert.strictEqual(emittedSuccess.length, 1);
  assert.strictEqual(emittedSuccess[0].event, 'messages-updated');

  console.log('✓ Socket.IO identity enforcement and BOLA boundaries secure.');
}

// Run suite
async function runSuite() {
  try {
    await testRESTAuth();
    await testSocketSecurity();
    console.log('\n--- ALL SECURITY TESTS PASSED SUCCESSFULLY ---');
  } catch (error) {
    console.error('\n❌ SECURITY TEST SUITE FAILED:');
    console.error(error);
    process.exit(1);
  }
}

runSuite();
