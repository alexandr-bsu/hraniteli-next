const TOP_MAIL_COUNTER_ID = 3503497;
const GOAL_LEADWIDE = 'Leadwide';

let ticketIdGoalSent: string | null = null;

export function resetHelpHandLeadwideDedupe(): void {
  ticketIdGoalSent = null;
}

function fireHelpHandLeadwideOnce(ticketId: string): void {
  if (!ticketId) return;
  if (ticketIdGoalSent === ticketId) return;

  try {
    if (typeof window === 'undefined') return;
    const w = window as Window & { _tmr?: object[] };
    w._tmr = w._tmr || [];
    w._tmr.push({
      type: 'reachGoal',
      id: TOP_MAIL_COUNTER_ID,
      goal: GOAL_LEADWIDE,
    });
    ticketIdGoalSent = ticketId;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Top.Mail] reachGoal Leadwide', { ticketId, goal: GOAL_LEADWIDE, id: TOP_MAIL_COUNTER_ID });
    }
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Top.Mail] reachGoal Leadwide failed', { ticketId });
    }
  }
}

/** Единая точка после успешной отправки квиза Help Hand (перед экраном gratitude). */
export function onHelpHandQuizCompletedSuccessfully(ticketId: string): void {
  fireHelpHandLeadwideOnce(ticketId);
}
