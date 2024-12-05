TEMPLATE FOR RETROSPECTIVE (Team 08)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- 3 stories committed and done
- 41 points committed and done 
- 114h20m planned vs 116h spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |     41  |    -   |    88      |      89      |
| _#6_   |     8   |    5   |    13      |      13      |
| _#7_   |     10  |    34  |    10      |      10      |
| _#8_   |     7   |    2   |    4       |      4       |

- Hours per task (average, standard deviation)
    - Estimated avg: 1h 51m
    - Actual avg: 1h 52m
    - Standard deviation: 0,02
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
    - -0,01

  
## QUALITY MEASURES 

- Unit Testing:
  - 10 hours estimated
  - 7 hours spent
  - 36 automated unit test cases 
  - Coverage (if available)
      - For entire Back-End: 28%
      - For entire Business Logic (Service Layer): 61% 
- E2E testing:
  - 6 hours estimated
  - 5 hours spent
- Code review 
  - 7 hours estimated 
  - 9 hours spent
- Technical Debt management:
  - Solve all issues with severity high or blocker after each commit in dev or in a Pull Request
  - 5 hours estimated at sprint planning
  - 2 hours spent
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - We thought that the technical debt would have been much higher.
    - Inexperience

- What lessons did you learn (both positive and negative) in this sprint?
    - Having files with too many Lines Of Code can cause maintainability issues and big merge conflicts
    - SpringBoot is good for our situation

- Which improvement goals set in the previous retrospective were you able to achieve? 
    - Goal: manage git in a more efficient way. We partially achieved this because we had issues merging all together 


- Which ones you were not able to achieve? Why?
    - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - More efficient git management.
    - More communication about your availability and status of your work

- One thing you are proud of as a Team!!
    - We always find a solution for problems