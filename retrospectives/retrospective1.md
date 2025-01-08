RETROSPECTIVE Team 08
=====================================

### Index

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- 3 stories done
- 47 points done
- 116h40m origanl estimation vs 118h10m spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|-------|---------|--------|------------|--------------|
| _#0_  | 9       | -      | 41h30m     | 40h30m       |
| _#1_  | 12      | 21     | 37h        | 46h40m       |
| _#2_  | 11      | 21     | 19h20m     | 18h30m       |
| _#3_  | 9       | 5      | 18h50m     | 12h30m       |


> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)  
  2,87h per task estimated vs 2,90h per task actual
  standard deviation = 0,03
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = -0,01$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_{task_i}}-1 \right| = 0,42$$

## QUALITY MEASURES

- Unit Testing:
    - Total hours estimated 4h30m
    - Total hours spent 2h30m
    - Number of automated unit test cases 7
    - Coverage (if available) --
- E2E testing:
    - Total hours estimated 10h 
    - Total hours spent 11h20m
- Code review
    - Total hours estimated 6h 
    - Total hours spent 8h

> We considered the testing estimation in the general estimation of every task. So we do not have precise statistics.

## ASSESSMENT

- What caused your errors in estimation (if any)?
    -  Bad definition of given user stories (e.g. US1)
    -  Loose glossary definitions
    -  Lack of communication between team memebers
    -  
- What lessons did you learn (both positive and negative) in this sprint?
    - API documentation and validation (from both frontend and backend teams) is a key aspect
    - We should know in the first two days where we are headed

- Which improvement goals set in the previous retrospective were you able to achieve?
    - Write a SSOT (Single Source Of Truth) containing all the necessary information to follow by the team (i.e.
      exchanged payloads between Backend and Frontend, APIs, ...)
    - Detailing the tasks in YouTrack so that everybody knows what they are about (e.g. add tags that help clarify
      what has to be done, ...)
    - Comment the code you are writing!

- Which ones you were not able to achieve? Why?
    - Plan tests in advance and write them (We should develop more tests)

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Meetings to define clearly how the story should be developed
    - Working on tasks sequentially starting from the first and not starting other stories until the DoD of the first.
    - Send daily messages about devewloping situation
    - We should make more code reviews (associtaing it to the task)

- One thing you are proud of as a Team!!
    - Single components development skills
    