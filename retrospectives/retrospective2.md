RETROSPECTIVE Team 08
=====================================

### Index

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- 2 stories done
- 55 points done
- 117h30m original estimation (131 actual estimation) vs 115h56m spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|-------|---------|--------|------------|--------------|
| _#0_  | 23      | -      | 93h        | 89h          |
| _#4_  | 12      | 34     | 18h        | 18h          |
| _#5_  | 6       | 21     | 6h30m      | 6h30m        |


> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual) 
  2.56h per task estimated vs 2.90h per task actual
  standard deviation per estimated = 0.049
  standard deviation per actual = 0.056
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = 0.13$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_{task_i}}-1 \right| = 0,003
- $$

## QUALITY MEASURES

- Unit Testing:
    - Total hours estimated 5h
    - Total hours spent 5h30m
    - Number of automated unit test cases 8
    - Coverage (if available) --
- E2E testing:
    - Total hours estimated 4h
    - Total hours spent 4h
- Code review
    - Total hours estimated 5h
    - Total hours spent 6h

## ASSESSMENT

- What caused your errors in estimation (if any)?
    - We underestimated the docker creation process
    - At first we thought that the changes needed to solve the issues raised during the last demo would have been quicker
- What lessons did you learn (both positive and negative) in this sprint?
    - We should be more conservative with the total hours assigned for a story, so that if we encounter some problems we have a "buffer task" which can be used for further testing and documentation (if we don't have any problems)

- Which improvement goals set in the previous retrospective were you able to achieve?
  - Meetings to define clearly how the story should be developed
  - Working on tasks sequentially starting from the first and not starting other stories until the DoD of the first.
   - Send daily messages about developing situation

- Which ones you were not able to achieve? Why?
  - We should make more code reviews (associtaing it to the task) (because we didn't assign some tasks for code review)

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Creation of story branches so that we can merge the single task branches into it (when they are done) and than merge the story branches into dev when the story is done

- One thing you are proud of as a Team!!
   - Single components development skills
    