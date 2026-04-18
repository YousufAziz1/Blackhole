import type { Quest, Submission } from '../types';

const QUESTS_KEY = 'bags_quests';

export const getQuests = (): Quest[] => {
  const data = localStorage.getItem(QUESTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getQuest = (id: string): Quest | undefined => {
  return getQuests().find((q) => q.id === id);
};

export const saveQuest = (quest: Quest): void => {
  const quests = getQuests();
  const existingIndex = quests.findIndex((q) => q.id === quest.id);
  if (existingIndex >= 0) {
    quests[existingIndex] = quest;
  } else {
    quests.push(quest);
  }
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const deleteQuest = (id: string): void => {
  const quests = getQuests();
  const updated = quests.filter(q => q.id !== id);
  localStorage.setItem(QUESTS_KEY, JSON.stringify(updated));
};

export const getSubmissions = (questId: string): Submission[] => {
  const data = localStorage.getItem(`bags_submissions_${questId}`);
  return data ? JSON.parse(data) : [];
};

export const getFanSubmissionForQuest = (questId: string, wallet: string): Submission | undefined => {
  return getSubmissions(questId).find(s => s.fanWallet === wallet);
};

export const saveSubmission = (submission: Submission): void => {
  const submissions = getSubmissions(submission.questId);
  const existingIndex = submissions.findIndex(s => s.id === submission.id);
  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions.push(submission);
  }
  localStorage.setItem(`bags_submissions_${submission.questId}`, JSON.stringify(submissions));
};

export const getAllFanSubmissions = (wallet: string): Submission[] => {
  const allQuests = getQuests();
  const allSubms: Submission[] = [];
  allQuests.forEach(q => {
    const subms = getSubmissions(q.id).filter(s => s.fanWallet === wallet);
    allSubms.push(...subms);
  });
  return allSubms;
};
