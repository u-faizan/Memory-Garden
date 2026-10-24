export const growthStages = ['seed', 'sprout', 'young', 'bud', 'bloom'] as const
export type GrowthStage = 'empty' | typeof growthStages[number]
