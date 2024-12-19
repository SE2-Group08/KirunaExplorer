TEMPLATE FOR RETROSPECTIVE (Team 08)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- 4 stories committed and done
- 35 points committed and done
- 117h 45m planned vs 114h 20m spent

**Remember**  a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|-------|---------|--------|-----------|-------------|
| _#0_  | 52      | -      | 88h       | 84h 30m     |
| _#9_  | 8       | 8      | 11h 35m   | 11h 35m     |
| _#19_ | 6       | 5      | 7h 5m     | 7h 5m       |
| _#10_ | 6       | 21     | 8h 40m    | 8h 40m      |
| _#20_ | 1       | 1      | 5m        | 5m          |

- Hours per task (average, standard deviation)
    - Estimated avg: 1h 36m
    - Actual avg: 1h 33m
    - Standard deviation: 0,02
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
    - 0,008


## QUALITY MEASURES

- Unit Testing:
    - 13h 25m hours estimated
    - 13h 40m hours spent
    -  106 automated unit test cases
    - Coverage (if available)
        - For entire Back-End: 29%
        - For entire Business Logic (Service Layer): 52%
- E2E testing:
    - 3h 30m hours estimated
    - 3h 30m hours spent
- Code review
    - 10 hours estimated
    - 9 hours spent
- Technical Debt management:
    - Solve all issues with severity high or blocker after each commit in dev or in a Pull Request
    - 4 hours estimated at sprint planning
    - 55m hours spent

    
## ASSESSMENT

- What caused your errors in estimation (if any)?
    - Doing authentication right is difficult and takes time.

- What lessons did you learn (both positive and negative) in this sprint?
    - Having files with too many Lines Of Code can cause maintainability issues and big merge conflicts
    - SpringBoot is good for our situation

- Which improvement goals set in the previous retrospective were you able to achieve?
    - None.

- Which ones you were not able to achieve? Why?
    - More efficient git management because the proficiency level for Git among team members is not equal.
    - More communication about your availability and status of your work.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - None.

- One thing you are proud of as a Team!!
    - We always land on our feet.