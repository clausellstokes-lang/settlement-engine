from lib import apply
pairs = [
(r'''the one catch law (the watch, the custody's guard, the captor's rung, the rescuer's fame)''',
 r'''the one catch law (the watch, the custody's guard, the jailer's rung, the rescuer's fame)'''),
(r'''the grievance always lands where the captor would believe it,''',
 r'''the grievance always lands where the jailer would believe it,'''),
(r'''the exposure of a turned man (the web's exposure machinery — `applyForeignExposureBlowback`); the captor's grievance.''',
 r'''the exposure of a turned man (the web's exposure machinery — `applyForeignExposureBlowback`); the jailer's grievance.'''),
]
apply(pairs, 'b6')
