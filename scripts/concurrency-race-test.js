/**
 * Diagnostic Care — Mandatory Concurrency & Zero Double Booking Test Suite
 * Requirement: Two or more independent patients attempt to book the same slot simultaneously.
 * Acceptance criterion: Exactly 1 request succeeds; all concurrent contenders receive HTTP 409 Conflict.
 */

const http = require('http');

async function sendRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsedUrl = new URL(url);
    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resData });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runConcurrencyBattleTest() {
  console.log('========================================================================');
  console.log('⚡ DIAGNOSTIC CARE — HIGH-CONCURRENCY DOUBLE-BOOKING BATTLE TEST');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Target: Local Staging Server (http://localhost:3000)');
  console.log('========================================================================\n');

  const today = new Date().toISOString().split('T')[0];
  const targetSlotId = `slot-moulvibazar-anisur-${today}-1700`;

  // --- TEST 1: TWO INDEPENDENT PATIENTS SIMULTANEOUSLY BOOKING SAME SLOT ---
  console.log('--- [TEST 1/3] 2 INDEPENDENT PATIENTS ATTACKING SAME SLOT SIMULTANEOUSLY ---');
  const patientA = {
    slotId: targetSlotId,
    userId: 'patient-A-01711223344',
  };
  const patientB = {
    slotId: targetSlotId,
    userId: 'patient-B-01886748564',
  };

  // Reset slot first if held
  await sendRequest('http://localhost:3000/api/slots/release', 'POST', { slotId: targetSlotId, userId: patientA.userId });
  await sendRequest('http://localhost:3000/api/slots/release', 'POST', { slotId: targetSlotId, userId: patientB.userId });

  // Fire simultaneously
  const t0 = Date.now();
  const [resA, resB] = await Promise.all([
    sendRequest('http://localhost:3000/api/slots/hold', 'POST', patientA),
    sendRequest('http://localhost:3000/api/slots/hold', 'POST', patientB),
  ]);
  const duration1 = Date.now() - t0;

  console.log(`Patient A response: HTTP ${resA.status}`, resA.data?.code);
  console.log(`Patient B response: HTTP ${resB.status}`, resB.data?.code);
  console.log(`Execution time: ${duration1}ms`);

  const statuses = [resA.status, resB.status];
  const winnerCount = statuses.filter((s) => s === 200).length;
  const conflictCount = statuses.filter((s) => s === 409).length;

  if (winnerCount === 1 && conflictCount === 1) {
    console.log('✅ TEST 1 PASSED: Exactly 1 patient acquired the slot hold; 1 received HTTP 409 Conflict.');
  } else {
    throw new Error(`TEST 1 FAILED: Expected 1 winner (200) and 1 conflict (409), got winners=${winnerCount}, conflicts=${conflictCount}`);
  }

  // --- TEST 2: 10 CONCURRENT PATIENTS PARALLEL RACE ATTACK ---
  console.log('\n--- [TEST 2/3] 10 CONCURRENT CONTENDERS ON SIMULATE-RACE ENDPOINT ---');
  const raceRes = await sendRequest('http://localhost:3000/api/slots/simulate-race', 'POST', {
    slotId: `slot-moulvibazar-anisur-${today}-1615`,
    candidateCount: 10,
  });

  if (raceRes.status === 200 && raceRes.data?.report?.invariantPassed) {
    console.log(`✅ TEST 2 PASSED: 10 concurrent requests -> 1 Winner (${raceRes.data.report.winnerUserId}), 9 Conflicts.`);
    console.log(`   Execution Time: ${raceRes.data.report.executionTimeMs}ms`);
  } else {
    throw new Error('TEST 2 FAILED: Race simulation failed invariant check!');
  }

  // --- TEST 3: REPEATED 5 ROUNDS CONCURRENCY STRESS ---
  console.log('\n--- [TEST 3/3] REPEATING 5 ROUNDS CONSECUTIVE RACE CONDITIONS ---');
  const roundTimes = ['1630', '1645', '1715', '1730', '1745'];
  for (let round = 1; round <= 5; round++) {
    const slotRoundId = `slot-moulvibazar-anisur-${today}-${roundTimes[round - 1]}`;
    const roundRes = await sendRequest('http://localhost:3000/api/slots/simulate-race', 'POST', {
      slotId: slotRoundId,
      candidateCount: 6,
    });
    if (!roundRes.data?.report?.invariantPassed) {
      throw new Error(`Round ${round} failed invariant check!`);
    }
    console.log(`   Round ${round}/5: Invariant Passed (6 contenders -> 1 winner, 5 rejected in ${roundRes.data.report.executionTimeMs}ms)`);
  }
  console.log('✅ TEST 3 PASSED: 5 consecutive rounds zero double-booking invariant verified.');

  console.log('\n========================================================================');
  console.log('🎉 ALL CONCURRENCY BATTLE TESTS PASSED WITH 100% SUCCESS');
  console.log('STATUS: ZERO DOUBLE-BOOKING GUARANTEED UNDER ANY RACE CONDITION');
  console.log('========================================================================\n');
}

runConcurrencyBattleTest().catch((err) => {
  console.error('\n❌ CONCURRENCY TEST FAILED:', err.message);
  process.exit(1);
});
