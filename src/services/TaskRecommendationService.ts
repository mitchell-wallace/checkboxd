import { TaskRecommendation } from '../models/TaskRecommendation';
import { TaskDataModel } from '../models/TaskDataModel';
import { taskRecommendations } from '../data/taskRecommendations';

class TaskRecommendationService {
  private recommendations: TaskRecommendation[] = [];

  constructor() {
    // Initialize with the predefined recommendations
    this.recommendations = [...taskRecommendations];
  }

  /**
   * Get recommendations based on existing tasks
   * @param existingTasks Current tasks in the list
   * @param inputText Current input text (if any)
   * @param limit Number of recommendations to return
   * @returns List of recommended tasks
   */
  getRecommendations(existingTasks: TaskDataModel[], inputText: string = '', limit: number = 5): TaskRecommendation[] {
    // Get task names that are already in the list to avoid duplicates
    const existingTaskNames = existingTasks.map(task => task.name.toLowerCase());
    
    // Filter out tasks that are already in the list
    const availableRecommendations = this.recommendations.filter(
      rec => !existingTaskNames.includes(rec.taskName.toLowerCase())
    );
    
    // If there's input text, use it to refine recommendations
    if (inputText.trim()) {
      const inputLower = inputText.toLowerCase();
      
      // Calculate scores for each recommendation based on the input text
      const scoredRecommendations = availableRecommendations.map(rec => {
        let score = 0;
        
        // Check if task name contains the input text
        if (rec.taskName.toLowerCase().includes(inputLower)) {
          score += 10; // Higher score for task name match
        }
        
        // Check if any keyword contains the input text
        for (const keyword of rec.keywords) {
          if (keyword.toLowerCase().includes(inputLower)) {
            score += 5; // Score for keyword match
          }
        }
        
        return { recommendation: rec, score };
      });
      
      // Sort by score (highest first) and take top N
      return scoredRecommendations
        .filter(item => item.score > 0) // Only include items with a score
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.recommendation);
    }
    
    // Without input text, score recommendations based on existing tasks
    const scoredRecommendations = availableRecommendations.map(rec => {
      let score = 0;
      
      // For each existing task, check how relevant this recommendation is
      for (const task of existingTasks) {
        const taskNameLower = task.name.toLowerCase();
        
        // Check if any keyword matches parts of existing task names
        for (const keyword of rec.keywords) {
          if (taskNameLower.includes(keyword.toLowerCase())) {
            score += 3; // Score for related keyword
          }
        }
      }
      
      return { recommendation: rec, score };
    });
    
    // Combine sorted recommendations with some random ones if we don't have enough
    let result = scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.recommendation);
    
    // If we don't have enough recommendations, add some random ones
    if (result.length < limit) {
      const randomRecs = this.getRandomRecommendations(
        availableRecommendations.filter(rec => !result.includes(rec)),
        limit - result.length
      );
      
      result = [...result, ...randomRecs];
    }
    
    return result;
  }
  
  /**
   * Get random recommendations from the available list
   * @param availableRecommendations Recommendations to choose from
   * @param count Number of recommendations to return
   * @returns Random selection of recommendations
   */
  private getRandomRecommendations(availableRecommendations: TaskRecommendation[], count: number): TaskRecommendation[] {
    const shuffled = [...availableRecommendations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export default TaskRecommendationService;
