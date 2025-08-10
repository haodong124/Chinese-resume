interface BaseSkill {
  name: string;
  category: string;
  level?: string;
}

/**
 * 技能去重工具函数
 * 基于 (name.trim().toLowerCase(), category.trim().toLowerCase()) 去重
 */
export const deduplicateSkills = <T extends BaseSkill>(skills: T[]): T[] => {
  const seen = new Set<string>();
  return skills.filter(skill => {
    const key = `${skill.name.trim().toLowerCase()}|${skill.category.trim().toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * 检查技能是否已存在
 */
export const isSkillDuplicate = <T extends BaseSkill>(skill: BaseSkill, existingSkills: T[]): boolean => {
  const normalizedName = skill.name.trim().toLowerCase();
  const normalizedCategory = skill.category.trim().toLowerCase();
  
  return existingSkills.some(existing => 
    existing.name.trim().toLowerCase() === normalizedName &&
    existing.category.trim().toLowerCase() === normalizedCategory
  );
};

/**
 * 合并技能数组并去重
 */
export const mergeAndDeduplicateSkills = <T extends BaseSkill>(skillArrays: T[][]): T[] => {
  const allSkills = skillArrays.flat();
  return deduplicateSkills(allSkills);
};

/**
 * 清空技能相关的本地存储
 */
export const clearSkillStorage = (): void => {
  localStorage.removeItem('ai-recommended-skills');
  localStorage.removeItem('ai-skill-history');
  localStorage.removeItem('custom-skills');
  localStorage.removeItem('skill-session-id');
};

/**
 * 生成会话ID，用于检测是否为新的推荐会话
 */
export const generateSessionId = (): string => {
  return `skill-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
