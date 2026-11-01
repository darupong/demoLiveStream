// Thai source text to English. Exact phrases win, then whole-string patterns,
// then word-by-word replacement for strings built from data (names, gifts, dates).
// ponytail: keyed by Thai text for a mockup; the real product needs message keys (next-intl).

export const LOCALE_KEY = 'ringside-locale-v1'

const NAMES: Record<string, string> = {
  ตะวันฉาย: 'Tawanchai', เพชรเมืองไทย: 'Petchmuangthai', สายฟ้าเหนือ: 'Saifah Nuea', ดาบทอง: 'Daabthong',
  พยัคฆ์ลำพูน: 'Payak Lamphun', เหล็กไหล: 'Lek Lai', ก้องภพ: 'Kongpob', สิงห์ทอง: 'Singthong',
  นารายณ์น้อย: 'Narai Noi', ปราบทอง: 'Prabthong', รุ่งฤทธิ์: 'Rungrit', ไชโย: 'Chaiyo',
  พายุใต้: 'Phayu Tai', สอนกล้า: 'Sonkla', ดวงดี: 'Duangdee', เมฆขลา: 'Mekkhala',
  ชัยยนต์: 'Chaiyon', เพชรดำ: 'Petchdam', ทองดี: 'Thongdee', ไกรสร: 'Kraisorn',
  วิรัช: 'Wirat', สามารถน้อย: 'Samart Noi', อนันต์: 'Anan', เขมราฐ: 'Khemmarat',
  ฟ้า: 'Fah', 'ฟ้า (คุณ)': 'Fah (you)', แฟนมวยโคราช: 'KoratFan', ป๋าเล็ก: 'Pa Lek', มุมแดงจัดไป: 'RedCornerFan',
  น้องเมย์: 'May', ลุงสมาน: 'Uncle Saman', เซียนมวยบางนา: 'BangnaExpert', พี่หนุ่ม: 'P Noom', ฟ้าใส: 'Fah Sai',
  สายบู๊: 'BrawlerFan', คนดูเงียบ: 'QuietViewer', ลุงแดง: 'Uncle Daeng',
}

const CAMPS: Record<string, string> = {
  ค่ายสิงห์ล้านนา: 'Singha Lanna Camp', ค่ายเพชรอีสาน: 'Phet Isan Camp', ค่ายกรุงธน: 'Krung Thon Camp',
  ค่ายพยัคฆ์ทักษิณ: 'Payak Thaksin Camp', ค่ายบูรพาชล: 'Burapha Chon Camp', ค่ายรวมใจสยาม: 'Ruamjai Siam Camp',
  สิงห์ล้านนา: 'Singha Lanna', เพชรอีสาน: 'Phet Isan', กรุงธน: 'Krung Thon',
  พยัคฆ์ทักษิณ: 'Payak Thaksin', บูรพาชล: 'Burapha Chon', รวมใจสยาม: 'Ruamjai Siam',
  ครูสมศักดิ์: 'Kru Somsak', ครูบุญมี: 'Kru Boonmee', ครูวิชัย: 'Kru Wichai', ครูอารีย์: 'Kru Aree', ครูประสิทธิ์: 'Kru Prasit', ครูมานพ: 'Kru Manop',
  เชียงใหม่: 'Chiang Mai', นครราชสีมา: 'Nakhon Ratchasima', กรุงเทพมหานคร: 'Bangkok', สงขลา: 'Songkhla', ชลบุรี: 'Chonburi', สุพรรณบุรี: 'Suphan Buri',
  'เน้นเตะและคุมระยะ ฝึกนักมวยรุ่นเล็กจนขึ้นเวทีใหญ่': 'Known for kicks and range control, raising young fighters up to the big stage.',
  ค่ายเก่าแก่ที่ขึ้นชื่อเรื่องความอึดและการเดินหน้า: 'A veteran camp famous for stamina and forward pressure.',
  ใช้ข้อมูลวิดีโอและคะแนนวิเคราะห์ช่วยวางแผนการชก: 'Uses video and analytics scores to plan every fight.',
  'เด่นเรื่องเข่าและวงใน ปั้นนักมวยสายบู๊จากภาคใต้': 'Strong on knees and the clinch, developing aggressive fighters from the south.',
  'ค่ายรุ่นใหม่ริมทะเล ฝึกนักมวยต่างชาติควบคู่นักมวยไทย': 'A new seaside camp training foreign and Thai fighters together.',
  'เน้นมวยฝีมือ แม่นจังหวะ และวินัยการซ้อม': 'Focused on technique, timing, and training discipline.',
}

const DATA: Record<string, string> = {
  รุ่นฟลายเวต: 'Flyweight', รุ่นแบนตัมเวต: 'Bantamweight', รุ่นเฟเธอร์เวต: 'Featherweight', รุ่นไลท์เวต: 'Lightweight', รุ่นเวลเตอร์เวต: 'Welterweight',
  สนามมวยเวทีกลาง: 'Central Stadium', สนามมวยริมน้ำ: 'Riverside Stadium',
  ไทย: 'Thailand', ญี่ปุ่น: 'Japan', ฝรั่งเศส: 'France', เนเธอร์แลนด์: 'Netherlands', เมียนมา: 'Myanmar', สหราชอาณาจักร: 'United Kingdom',
  มวยหมัด: 'Boxer', มวยเตะ: 'Kicker', มวยเข่า: 'Knee fighter', มวยศอก: 'Elbow fighter',
  หมัด: 'Punches', เตะ: 'Kicks', เข่า: 'Knees', ศอก: 'Elbows',
  'ซ้ายนำ (Southpaw)': 'Southpaw', 'ขวานำ (Orthodox)': 'Orthodox', ซ้ายนำ: 'Southpaw', ขวานำ: 'Orthodox',
  ดอกไม้: 'Flower', ดาว: 'Star', พวงมาลัย: 'Garland', นวมทอง: 'Golden Glove', เข็มขัดแชมป์: 'Champion Belt',
  กางเกงมวยตะวันฉาย: 'Tawanchai fight shorts', 'นวมซ้อม 12 ออนซ์': '12 oz training gloves', เสื้อค่ายเพชรอีสาน: 'Phet Isan camp shirt', ผ้าพันมือ: 'Hand wraps', เสื้อค่ายกรุงธน: 'Krung Thon camp shirt', ร้านอุปกรณ์มวย: 'Fight Gear Store',
  สัมภาษณ์: 'Interview', สารคดี: 'Documentary', สอนเทคนิค: 'Technique',
  เตะเฉียงให้คมและไม่เสียหลัก: 'Sharp roundhouse kicks without losing balance', หมัดตรงนำเข้าวงใน: 'Using the straight punch to enter the clinch',
  ศอกกลับในจังหวะคู่ชกพลาด: 'Counter elbows when an opponent misses', จับคอและเข่าโค้ง: 'Clinch and curved knees',
  ถีบกันระยะแบบไม่ให้คู่ชกเข้าถึง: 'Teep to keep your opponent out of range', ไหว้ครูรำมวยสำหรับผู้เริ่มต้น: 'Wai Kru Ram Muay for beginners',
  เปิดรายการ: 'Intro', การเตรียมตัวก่อนชก: 'Fight preparation', จุดเปลี่ยนในเวที: 'The turning point', เป้าหมายปีนี้: "This year's goals", ฝากถึงแฟนมวย: 'A message to fans',
  เช้าวันซ้อม: 'Training morning', การฝึกพื้นฐาน: 'The basics', ชีวิตในค่าย: 'Camp life', เบื้องหลังเวที: 'Behind the ring', ก้าวต่อไปของค่าย: "The camp's next step",
  อุ่นเครื่อง: 'Warm-up', ท่าพื้นฐาน: 'Basic form', ข้อผิดพลาดที่พบบ่อย: 'Common mistakes', ซ้อมกับเป้า: 'Pad work', สรุปท้ายคลิป: 'Recap',
  'สวัสดีครับ วันนี้เรามาคุยกันแบบสบาย ๆ หลังการซ้อม': "Hi everyone. Today we're having a relaxed chat after training.",
  'ช่วงนี้ซ้อมวันละสองรอบ เช้าวิ่ง เย็นเข้าเป้า': 'I train twice a day right now: running in the morning, pads in the evening.',
  ไฟต์ที่แล้วผมเรียนรู้เรื่องการคุมระยะเยอะมาก: 'My last fight taught me a lot about controlling range.',
  พอถึงยกสามผมรู้ว่าต้องเปลี่ยนจังหวะทันที: 'By round three I knew I had to change the rhythm right away.',
  'ครูบอกเสมอว่าอย่ารีบ ให้คู่ต่อสู้พลาดเอง': 'My trainer always says not to rush and let the opponent make the mistake.',
  ปีนี้เป้าหมายคือขึ้นชิงแชมป์ให้ได้: 'My goal this year is a title shot.',
  เรื่องน้ำหนักก็ต้องคุมตั้งแต่ก่อนแข่งเป็นเดือน: 'Weight has to be managed a month before the fight.',
  ขอบคุณแฟนมวยที่เชียร์กันมาตลอดครับ: 'Thank you to the fans who always cheer for me.',
  'ตีห้าครึ่ง เสียงนักมวยเริ่มดังขึ้นทั่วค่าย': 'At 5:30 a.m. the sound of fighters fills the camp.',
  ทุกคนเริ่มจากวิ่งสิบกิโลเมตรก่อนกินข้าวเช้า: 'Everyone runs ten kilometers before breakfast.',
  ครูจะดูการยืนของนักมวยทุกคนก่อนเข้าเป้า: "The trainers check every fighter's stance before pad work.",
  เด็กใหม่ใช้เวลาเป็นปีกว่าจะได้ขึ้นเวทีแรก: 'New kids train for a year before their first fight.',
  บ่ายสามคือช่วงซ้อมหนักที่สุดของวัน: '3 p.m. is the hardest session of the day.',
  ที่นี่ทุกคนกินข้าวและนอนด้วยกันเหมือนครอบครัว: 'Everyone here eats and sleeps together like a family.',
  ก่อนแข่งครูจะวางแผนแยกกับนักมวยทีละคน: 'Before a fight, trainers plan with each fighter one to one.',
  ค่ายยังตั้งใจส่งต่อวิชานี้ให้รุ่นต่อไป: 'The camp is committed to passing this art to the next generation.',
  ก่อนเริ่มให้อุ่นสะโพกและข้อเท้าให้พร้อม: 'Warm up your hips and ankles before you start.',
  'ยืนให้เท้าห่างเท่าช่วงไหล่ น้ำหนักกลางตัว': 'Stand with feet shoulder-width apart and your weight centered.',
  'เริ่มจากหมุนเท้าหลักก่อน แล้วค่อยส่งสะโพก': 'Pivot the base foot first, then drive the hip.',
  จุดพลาดที่เจอบ่อยคือเอนตัวไปหลังมากเกินไป: 'The most common mistake is leaning back too far.',
  'ลองช้า ๆ สิบครั้งโดยยังไม่ต้องใช้แรง': 'Try ten slow reps without using power.',
  เมื่อจังหวะถูกแล้วค่อยเพิ่มความเร็ว: 'Add speed once the timing is right.',
  เข้าเป้าให้โดนด้วยจุดเดิมทุกครั้ง: 'Hit the pad with the same spot every time.',
  สรุปคือฝึกจังหวะก่อนฝึกแรงเสมอ: 'In short, always train timing before power.',
  'ชอบคลิปนี้มาก ดูแล้วอยากไปซ้อมเลย': 'Love this video. It makes me want to train.',
  'พูดตรงใจแฟนมวยจริง ๆ': 'This is exactly what fans wanted to hear.',
  ขอตอนต่อไปด้วยครับ: 'Please make a next episode.',
  ดูจบแล้วเข้าใจมวยมากขึ้น: 'I understand Muay Thai better after this.',
  ทีมงานตัดต่อดีมาก: 'Great editing by the team.',
  เชียร์เสมอครับ: 'Always cheering for you.',
  เตะสวยมาก: 'Beautiful kick', 'เข่าเข้าเต็ม ๆ': 'That knee landed clean', ยกนี้สนุก: 'Great round', 'สู้ ๆ': 'Keep fighting', คมจริง: 'So sharp',
  ใครจะชนะ: 'Who wins this?', จังหวะดีมาก: 'Great timing', หมัดหนัก: 'Heavy punches', เชียร์สุดใจ: 'Cheering with all my heart',
  เตะซ้ายตะวันฉายคมมาก: "Tawanchai's left kick is so sharp", ยกนี้เพชรเมืองไทยต้องเดินหน้าแล้ว: 'Petchmuangthai has to press this round', 'สู้ ๆ ตะวันฉาย!': 'Come on, Tawanchai!',
  'มุมแดงคุมระยะด้วยเตะซ้าย มุมน้ำเงินตอบกลับช้า': 'Red corner controlled range with left kicks. Blue corner was slow to answer.',
  'มุมแดงเข้าคลุกได้แต้มจากเข่า มุมน้ำเงินเริ่มเดินหน้าปลายยก': 'Red corner scored with knees in the clinch. Blue corner pressed late in the round.',
  ข้อความโฆษณาเว็บพนัน: 'Gambling site advertisement', ข้อความด่าทอนักมวย: 'Insults aimed at a fighter', 'ส่งข้อความซ้ำ 12 ครั้ง': 'Sent the same message 12 times',
  สแปม: 'Spam', คำหยาบ: 'Profanity', ก่อกวน: 'Harassment',
  'เติม Credit จากระบบภายนอก': 'Credit top-up from external system',
  'ได้รับสัญญาณจาก OBS (push_start)': 'Signal received from OBS (push_start)', 'สัญญาณขาดช่วง (push_end) เริ่มนับเวลารอ 60 วินาที': 'Signal dropped (push_end), 60 second wait started', 'สัญญาณกลับมา (push_start)': 'Signal restored (push_start)',
  'Admin หยุดรายการ และบล็อกการส่งสัญญาณซ้ำ': 'Admin stopped the event and blocked the signal from resuming',
  ไม่ได้รับผลภายในเวลาที่กำหนด: 'No result received in time',
  กำลังเตรียมไฟล์: 'Preparing file', เตรียมไฟล์ไม่สำเร็จ: 'File preparation failed', เผยแพร่แล้ว: 'Published', รอคิว: 'Queued', เสร็จแล้ว: 'Done',
}

const UI: Record<string, string> = {
  // Navigation and shell
  ถ่ายทอดสด: 'Live', ดูย้อนหลัง: 'Replays', นักมวย: 'Fighters', หน้าหลัก: 'Home', หน้าแรก: 'Home', ย้อนหลัง: 'Replays', เส้นทาง: 'Breadcrumb', เมนูหลัก: 'Main menu',
  'เมนู Back Office': 'Back Office menu', รายการถ่ายทอด: 'Broadcasts', ย่อ: 'Hide', ขยาย: 'Expand', ย่อแถบซ้าย: 'Collapse left panel', ขยายแถบซ้าย: 'Expand left panel', เลือกภาษา: 'Choose language', ภาษาไทย: 'Thai',
  'LIVESTREAM mockup ข้อมูลทั้งหมดเป็นข้อมูลจำลอง': 'LIVESTREAM mockup. All data is simulated.', โปรไฟล์: 'Profile', กลับหน้าผู้ชม: 'Back to viewer site',
  สลับสถานะจำลอง: 'Mock states', ข้อมูลการถ่ายทอดสดตอนนี้: 'Live broadcasts now', ดูทั้งหมด: 'See all',
  // Home
  กำลังถ่ายทอดสด: 'Live now', '▶ ดูถ่ายทอดสด': '▶ Watch live', ดูถ่ายทอดสด: 'Watch live', ข้อมูลรายการ: 'Event info', เลือกรายการถ่ายทอดสด: 'Choose live broadcast',
  ดูต่อจากที่ค้างไว้: 'Continue watching', '10 อันดับยอดนิยม': 'Top 10', รายการที่จะมาถึง: 'Upcoming', ดูย้อนหลังล่าสุด: 'Latest replays', ไฮไลต์น็อกเด็ด: 'Best knockouts',
  บทสัมภาษณ์นักมวย: 'Fighter interviews', เบื้องหลังค่ายมวย: 'Inside the camps', สอนเทคนิคมวยไทย: 'Muay Thai techniques', นักมวยแนะนำ: 'Featured fighters', น็อก: 'KO', ยังไม่มีรายการในตอนนี้: 'No events right now',
  รายการใหม่จะแสดงที่หน้านี้เมื่อประกาศตารางแข่ง: 'New events appear here when the schedule is announced.', 'เร็ว ๆ นี้': 'Coming soon',
  กำลังโหลดรายการ: 'Loading events', โหลดรายการไม่สำเร็จ: "Events didn't load", 'ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองอีกครั้ง': 'Check your internet connection, then try again.', ลองอีกครั้ง: 'Try again', มีรายการ: 'Has events', กำลังโหลด: 'Loading', ไม่มีรายการ: 'No events', โหลดไม่สำเร็จ: 'Failed to load',
  รายการถัดไป: 'Up next', กำลังถ่ายทอด: 'Live now',
  // Event
  วันเวลา: 'Date and time', สนาม: 'Venue', รุ่น: 'Division', กำหนด: 'Scheduled', ค่ารับชม: 'Price', เข้าสู่ระบบเพื่อตรวจสิทธิ์รับชมรายการนี้: 'Log in to check your access to this event.',
  บัญชีนี้ยังไม่มีสิทธิ์รับชมรายการนี้: "This account doesn't have access to this event.", สิทธิ์ผู้ชม: 'Viewer access', 'มีสิทธิ์ PPV': 'Has PPV access', 'Login แล้ว ไม่มีสิทธิ์': 'Logged in, no access', 'ยังไม่ Login': 'Not logged in',
  // Live
  รอเริ่ม: 'Waiting to start', สัญญาณหลุด: 'Signal lost', ลิงก์รับชมหมดอายุ: 'Viewing link expired', 'จบแล้ว VOD พร้อม': 'Ended, replay ready', 'จบแล้ว VOD ยังไม่พร้อม': 'Ended, replay not ready',
  'การถ่ายทอดสดจะเริ่มเร็ว ๆ นี้': 'The broadcast starts soon', สัญญาณภาพขาดช่วง: 'Video signal dropped', 'กำลังเชื่อมต่อใหม่อัตโนมัติ รายการยังไม่จบ': 'Reconnecting automatically. The event is still on.', เชื่อมต่ออีกครั้ง: 'Reconnect',
  กำลังขอลิงก์ใหม่และกลับเข้ารับชมให้อัตโนมัติ: 'Getting a new link and returning you to the stream.', กลับเข้ารับชม: 'Back to stream', จบการถ่ายทอดสด: 'Broadcast ended', ดูย้อนหลังได้แล้ว: 'The replay is ready.',
  'ไฟล์ย้อนหลังยังไม่พร้อม กำลังเตรียมไฟล์และรอตรวจก่อนเผยแพร่': "The replay isn't ready. It's being prepared and reviewed before publishing.", เข้าสู่ระบบเพื่อรับชม: 'Log in to watch',
  ต้องเข้าสู่ระบบก่อนตรวจสิทธิ์รับชมรายการนี้: 'Log in first so we can check your access.', บัญชีนี้ยังไม่มีสิทธิ์รับชม: "This account doesn't have access", ซื้อสิทธิ์รับชมรายการนี้เพื่อดูถ่ายทอดสด: 'Buy access to watch this broadcast.',
  'ภาพหน่วง 30 วินาทียังไม่พร้อม': "The 30-second delayed feed isn't ready", 'โหมด AI ต้องรอภาพสะสมหลังเริ่มถ่ายทอดประมาณ 30 วินาที': 'AI mode needs about 30 seconds of video after the broadcast starts.', 'ข้อมูล Skeleton ยังไม่พร้อม ภาพจะยังเล่นต่อ': "Skeleton data isn't ready. Video keeps playing.",
  เต็มจอ: 'Fullscreen', มวยไทย: 'Muay Thai', ร้านค้า: 'Shop', แชร์การแข่งขัน: 'Share fight', 'จุดและเส้นบนภาพเป็นตัวอย่างประกอบ งานวาดจริงเป็นของทีม AI': 'Points and lines are illustrative. The real overlay comes from the AI team.',
  หยุดชั่วคราว: 'Pause', เล่น: 'Play', เปิดเสียง: 'Unmute', ปิดเสียง: 'Mute', หยุดเล่น: 'Stopped', ภาพถ่ายทอดสดจำลอง: 'Simulated live video', คะแนนยกล่าสุด: 'Latest round score', เวลาในยก: 'Round time', ตามเวลาปัจจุบัน: 'Current time', 'เริ่มยกใหม่ 5 วินาที': 'Round started 5 seconds ago',
  'ภาพโหมด AI': 'AI mode video', พร้อม: 'Ready', 'เปิดใน 30 วินาทีแรก': 'Opened in first 30 seconds', 'ข้อมูล Skeleton': 'Skeleton data', ยังไม่พร้อม: 'Not ready', 'สถานะ Live': 'Live status', แชท: 'Chat',
  // Score
  ผลพร้อมแล้ว: 'Result ready', รอผล: 'Waiting for result', กำลังประมวลผล: 'Processing', ประมวลผลล้มเหลว: 'Processing failed', กำลังลองใหม่: 'Retrying', 'ยังไม่ถึงเวลาแสดง (กันสปอยล์)': 'Hidden to avoid spoilers', 'ยังไม่มีผล ทีมงานกำลังตรวจสอบ': 'No result yet. The team is checking.',
  แสดงเมื่อดูถึงยกนี้: 'Shown when you reach this round', การแข่งขันปัจจุบัน: 'Current fight', กำลังแข่งขัน: 'In progress', มุมแดง: 'Red corner', มุมน้ำเงิน: 'Blue corner', คะแนนรายยก: 'Round scores', สรุปรายยก: 'Round recap',
  // Chat and gifts
  ประวัติแชท: 'Chat history', คะแนนเชียร์จากผู้ชม: 'Fan cheer score', ศึกแฟนมวย: 'Fan Battle', แชทสด: 'Live chat', ย่อแถบแชท: 'Collapse chat', 'โหมด AI ปิดแชท เชียร์ และของขวัญ': 'AI mode turns off chat, cheers, and gifts',
  กลับไปโหมดถ่ายทอดสดเพื่อใช้งาน: 'Switch back to live mode to use them.', แชทเปิดเฉพาะผู้มีสิทธิ์รับชม: 'Chat is for viewers with access', 'เข้าสู่ระบบและมีสิทธิ์รับชมก่อนใช้แชท เชียร์ และของขวัญ': 'Log in with access to use chat, cheers, and gifts.', แชทเปิดระหว่างถ่ายทอดสด: 'Chat is open during live broadcasts',
  แชทสดแบบย่อ: 'Collapsed live chat', เปิดแถบแชท: 'Open chat', รายงาน: 'Report', รายงานแล้ว: 'Reported', ยืนยันส่งของขวัญ: 'Confirm gift', ยืนยันส่ง: 'Confirm', ยกเลิก: 'Cancel', 'เติม Credit': 'Top up Credit', ปิด: 'Close', ส่งของขวัญให้: 'Send gift to',
  ข้อความแชท: 'Chat message', ส่งข้อความ: 'Send a message', ส่ง: 'Send', 'บัญชีนี้ถูกบล็อกจากแชทในรายการนี้': 'This account is blocked from chat in this event.', บัญชีนี้ไม่มีสิทธิ์แชทในรายการนี้: "This account can't chat in this event.", เข้าสู่ระบบเพื่อแชทกับคนดู: 'Log in to chat with viewers',
  ส่งได้ปกติ: 'Sending normally', ส่งไม่สำเร็จ: 'Send failed', ส่งถี่เกินกำหนด: 'Rate limited', ถูกบล็อก: 'Blocked', ไม่มีสิทธิ์แชท: 'No chat access', 'ส่งข้อความไม่สำเร็จ กดส่งอีกครั้ง': "Message didn't send. Press send again.", 'ส่งข้อความถี่เกินไป รอ 10 วินาทีแล้วส่งใหม่': 'Too many messages. Wait 10 seconds and try again.',
  // Shop
  'เปิดสินค้าที่ปักไว้': 'Show pinned product', '📌 เปิดสินค้าที่ปักไว้': '📌 Show pinned product', '📌 สินค้าที่ปักไว้': '📌 Pinned product', ซื้อ: 'Buy', ปิดสินค้าที่ปักไว้: 'Close pinned product', มีสินค้า: 'Has products', ไม่มีสินค้า: 'No products', สินค้าจากรายการนี้: 'Products from this event', โหลดสินค้าไม่สำเร็จ: "Products didn't load", รายการนี้ยังไม่มีสินค้า: 'This event has no products yet', กำลังโหลดสินค้า: 'Loading products', '📌 ปักอยู่': '📌 Pinned',
  // Fighters
  'ยังไม่มีตารางชกครั้งถัดไป รายการใหม่จะแสดงที่นี่เมื่อประกาศ': 'No next fight scheduled. New fights appear here when announced.', 'ชนะ-แพ้-เสมอ': 'W-L-D', อัตราชนะ: 'Win rate', 'คะแนน AI เฉลี่ย': 'Average AI score', 'ส่วนสูง / ช่วงแขน': 'Height / reach', ผล: 'Result', 'ผล 5 ไฟต์ล่าสุด': 'Last 5 fights',
  อัตราชนะน็อก: 'KO rate', ฟอร์มตอนนี้: 'Current form', ไฟต์ติดต่อกัน: 'fights in a row', วิธีการชนะ: 'How they win', อาวุธที่ออกเข้าเป้า: 'Strikes landed', แรงที่สุดยกไหน: 'Strongest round', 'ตัวเลขคือคะแนน AI ซ้ายบนคือไฟต์ล่าสุด': 'Numbers are AI scores. Top left is the latest fight.',
  ของขวัญจากผู้ชม: 'Gifts from fans', ไฟต์ถัดไป: 'Next fight', ประวัติการชก: 'Fight history', วันที่: 'Date', คู่ชก: 'Opponent', วิธี: 'Method', ยก: 'Round', คลิป: 'Clip', ดูคลิป: 'Watch', ยังไม่เปิด: 'Not available', คู่ที่เคยเจอ: 'Past opponents', 'ตำแหน่งและรางวัล': 'Titles and awards', จังหวัด: 'Province', ก่อตั้ง: 'Founded',
  หัวหน้าเทรนเนอร์: 'Head trainer', เพื่อนร่วมค่าย: 'Teammates', ข้อมูลร่างกาย: 'Physical stats', อายุ: 'Age', ส่วนสูง: 'Height', ช่วงแขน: 'Reach', การยืน: 'Stance', สไตล์: 'Style', 'ข้อมูลทั้งหมดในหน้านี้เป็นข้อมูลจำลอง ระบบจริงต้องใช้ผลจากระบบ AI คะแนน': 'All data here is simulated. The real system uses results from AI scoring.',
  ชนะ: 'Win', แพ้: 'Loss', เสมอ: 'Draw', ชนะน็อก: 'Win by KO', ชนะคะแนน: 'Win on points', ชนะเทคนิค: 'Win by TKO', คะแนน: 'Points', เทคนิค: 'TKO', รายการแข่งขัน: 'Fights', 'เปิดหน้าโปรไฟล์เต็มในแท็บใหม่': 'Open full profile in a new tab', ครั้งที่ชนะ: 'wins', ต่อไฟต์: 'per fight', แฟนที่ให้มากที่สุด: 'Top fans',
  รอไฟล์ย้อนหลัง: 'Replay pending', ดูย้อนหลังได้: 'Replay available', 'ยังไม่เคยเจอกันในไฟต์ล่าสุด': 'No recent meetings', 'ทั้งคู่ยังไม่เคยเจอกันในไฟต์ล่าสุด': "They haven't met in recent fights.", ดูรายการ: 'View event', 'กำลังชกอยู่ ดูสด': 'Fighting now, watch live', ไฟต์: 'fights', ติดต่อกัน: 'in a row', ตลอดอาชีพ: 'Career', ดูสด: 'Watch live',
  // Auth and profile
  ลืมรหัสผ่าน: 'Forgot password', 'ถ้าอีเมลนี้มีบัญชีอยู่ ลิงก์ตั้งรหัสผ่านใหม่จะถูกส่งไปที่กล่องจดหมาย': 'If this email has an account, a reset link is on its way.', 'เปิดลิงก์จากอีเมล (ตัวอย่าง)': 'Open the email link (sample)', อีเมล: 'Email', ส่งลิงก์ตั้งรหัสผ่านใหม่: 'Send reset link', กลับไปเข้าสู่ระบบ: 'Back to login',
  อีเมลหรือรหัสผ่านไม่ถูกต้อง: 'Incorrect email or password', เข้าสู่ระบบ: 'Log in', รหัสผ่าน: 'Password', สมัครสมาชิก: 'Sign up', ผลการเข้าสู่ระบบ: 'Login result', สำเร็จ: 'Success', รหัสผ่านผิด: 'Wrong password', 'Session หมดอายุ': 'Session expired', 'Session หมดอายุ เข้าสู่ระบบอีกครั้งเพื่อรับชมต่อ': 'Your session expired. Log in again to keep watching.',
  ชื่อที่แสดง: 'Display name', 'Credit คงเหลือ': 'Credit balance', บันทึกโปรไฟล์: 'Save profile', บันทึกโปรไฟล์แล้ว: 'Profile saved', สิทธิ์รับชมของฉัน: 'My access', 'ประวัติ Credit และของขวัญ': 'Credit and gift history', เวลา: 'Time', รายการ: 'Item', คงเหลือ: 'Balance', ออกจากระบบ: 'Log out',
  'อีเมลนี้มีบัญชีอยู่แล้ว เข้าสู่ระบบหรือใช้อีเมลอื่น': 'This email already has an account. Log in or use another email.', 'รหัสผ่าน อย่างน้อย 8 ตัวอักษร': 'Password, at least 8 characters', 'มีบัญชีแล้ว เข้าสู่ระบบ': 'Have an account? Log in', ผลการสมัคร: 'Sign-up result', อีเมลซ้ำ: 'Duplicate email',
  รหัสผ่านทั้งสองช่องไม่ตรงกัน: "The passwords don't match", ตั้งรหัสผ่านใหม่: 'Set new password', 'ลิงก์นี้หมดอายุแล้ว ขอลิงก์ใหม่เพื่อตั้งรหัสผ่าน': 'This link expired. Request a new one to set your password.', ขอลิงก์ใหม่: 'Request new link', ตั้งรหัสผ่านใหม่แล้ว: 'Password updated', 'รหัสผ่านใหม่ อย่างน้อย 8 ตัวอักษร': 'New password, at least 8 characters', ยืนยันรหัสผ่านใหม่: 'Confirm new password', ลิงก์จากอีเมล: 'Email link', ใช้ได้: 'Valid', หมดอายุ: 'Expired',
  // Replay
  ยังไม่มีรายการย้อนหลัง: 'No replays yet', รายการจะแสดงที่หน้านี้เมื่อผ่านการอนุมัติ: 'Replays appear here after approval.', หน้ารายการย้อนหลัง: 'Replay list', หน้ารวม: 'Overview', 'หน้ารวม Event': 'Events',
  ตำแหน่งวิดีโอ: 'Video position', ส่วนของการถ่ายทอด: 'Broadcast parts', 'สถานะ VOD': 'Replay status', พร้อมรับชม: 'Ready to watch', กำลังเตรียม: 'Preparing', รอตรวจ: 'In review', ล้มเหลว: 'Failed', ไม่มีสิทธิ์: 'No access',
  กำลังเตรียมไฟล์ย้อนหลัง: 'Preparing the replay', ไฟล์จะพร้อมหลังจบรายการไม่นาน: 'The file is ready soon after the event.', ไฟล์ย้อนหลังรอตรวจ: 'The replay is in review', เปิดให้รับชมเมื่อผ่านการอนุมัติ: 'It opens after approval.', เตรียมไฟล์ย้อนหลังไม่สำเร็จ: "The replay couldn't be prepared", 'ทีมงานกำลังตรวจสอบ ติดต่อฝ่ายช่วยเหลือหากต้องการข้อมูลเพิ่มเติม': 'The team is checking. Contact support for more details.', ซื้อสิทธิ์เพื่อดูย้อนหลัง: 'Buy access to watch the replay.',
  // Watch
  เมื่อสักครู่: 'Just now', เล่นเลย: 'Play now', วิดีโอถัดไป: 'Next video', เล่นถัดไปอัตโนมัติ: 'Autoplay', 'เล่นถัดไปอัตโนมัติใน 5 วินาที': 'Autoplay in 5 seconds', โหมดโรงภาพยนตร์: 'Theater mode', ออกจากโหมดโรงภาพยนตร์: 'Exit theater mode', ติดตาม: 'Follow', ติดตามแล้ว: 'Following', ไม่ถูกใจ: 'Dislike', แชร์: 'Share', คัดลอกลิงก์แล้ว: 'Link copied', บันทึก: 'Save', บันทึกแล้ว: 'Saved',
  คำอธิบายวิดีโอ: 'Video description', ตอนย่อย: 'Chapters', แสดงบทสนทนา: 'Show transcript', เพิ่มเติม: 'More', แสดงน้อยลง: 'Show less', ความคิดเห็น: 'Comments', เรียงความคิดเห็น: 'Sort comments', ยอดนิยม: 'Top', ล่าสุด: 'Newest', เขียนความคิดเห็น: 'Write a comment', เพิ่มความคิดเห็น: 'Add a comment', แสดงความคิดเห็น: 'Comment', บทสนทนา: 'Transcript', ปิดบทสนทนา: 'Close transcript', วิดีโอแนะนำ: 'Recommended videos', กรองวิดีโอแนะนำ: 'Filter recommendations', ทั้งหมด: 'All',
  // Back office
  สิทธิ์รับชม: 'Viewing access', ค้นหาอีเมล: 'Search email', 'สิทธิ์มาจากระบบชำระเงินภายนอก หน้านี้ใช้ตรวจสอบเท่านั้น': 'Access comes from the external payment system. This page is read-only.', ผู้ใช้: 'User', ได้รับสิทธิ์: 'Granted', เลขอ้างอิง: 'Reference', ไม่พบสิทธิ์ของอีเมลนี้: 'No access found for this email',
  สถานะ: 'Status', ควบคุมรายการ: 'Control event', ธุรกรรมของขวัญ: 'Gift transactions', เลขธุรกรรม: 'Transaction', ผู้ส่ง: 'Sender', ของขวัญ: 'Gift', ผู้รับ: 'Recipient', ดูแลแชท: 'Chat moderation', ข้อความ: 'Message', เหตุผล: 'Reason', จัดการ: 'Actions', บล็อก: 'Block', ปิดรายงาน: 'Dismiss report', บล็อกในรายการนี้แล้ว: 'Blocked in this event', ปิดรายงานแล้ว: 'Report dismissed',
  ภาพรวม: 'Overview', รายการกำลังถ่ายทอด: 'Live events', 'VOD รอตรวจ': 'Replays in review', 'งานคะแนน AI ล้มเหลว': 'Failed AI score jobs', รายงานแชทรอจัดการ: 'Open chat reports', ผู้ชม: 'Viewers', เริ่ม: 'Start', 'สินค้า Popup': 'Popup products', เลือกรายการ: 'Choose event', 'ตั้งค่าแยกต่อรายการ และปักได้ครั้งละ 1 สินค้า เปิดหน้า Live ของรายการนี้ไว้อีกแท็บแล้วการ์ดสินค้าจะเปลี่ยนทันที': "Set per event, one pinned product at a time. Keep this event's Live page open in another tab to see the card change right away.",
  สินค้า: 'Product', ร้าน: 'Seller', ราคา: 'Price', แสดงในรายการนี้: 'Show in this event', 'ปักบนหน้า Live': 'Pin on Live page', แสดง: 'Shown', ซ่อน: 'Hidden', ปักสินค้า: 'Pin product', '📌 เลิกปัก': '📌 Unpin', 'คะแนน AI': 'AI score', 'ผลจาก AI': 'AI result', 'ดู JSON': 'View JSON', ลองใหม่: 'Retry', 'อนุมัติ VOD': 'Approve replays', ไฟล์บันทึก: 'Recordings', ตรวจไฟล์: 'Review files',
  'จบแล้ว รอ VOD': 'Ended, replay pending', 'เผยแพร่ VOD แล้ว': 'Replay published', ไม่ได้ถ่ายทอด: 'Off air', สัญญาณขาดช่วง: 'Signal dropped', จบรายการ: 'Ended', จบตามปกติ: 'Ended normally', สัญญาณหลุดเกินเวลารอ: 'Signal lost past the wait time', 'Admin สั่งหยุด': 'Stopped by admin', 'ค่าสำหรับ OBS': 'OBS settings', 'แสดง Stream Key': 'Show Stream Key', 'ซ่อน Stream Key': 'Hide Stream Key', บันทึกสถานะสัญญาณ: 'Signal log', 'ยังไม่ได้รับสัญญาณจาก OBS': 'No signal from OBS yet', สถานะสัญญาณ: 'Signal status', ตอนนี้: 'Now', เวลารอสัญญาณกลับ: 'Time left for signal', เหตุผลที่จบ: 'End reason', หยุดรายการ: 'Stop event',
  'ผู้ชมจะเห็นหน้าจบการถ่ายทอด และ OBS จะส่งสัญญาณกลับเข้ารายการนี้ไม่ได้': "Viewers will see the broadcast-ended screen and OBS can't resume this event.", ยืนยันหยุดรายการ: 'Confirm stop', รายการนี้ยังไม่เริ่มถ่ายทอด: "This event hasn't started.", 'รายการนี้จบแล้ว ไฟล์บันทึกจะไปรอตรวจที่หน้าอนุมัติ VOD': 'This event ended. Recordings go to Approve replays.', 'ไปหน้าอนุมัติ VOD': 'Go to Approve replays', 'สัญญาณจาก OBS': 'OBS signal', ส่งสัญญาณปกติ: 'Signal normal',
  ไฟล์บันทึกของรายการนี้: "This event's recordings", 'เตรียมไฟล์ไม่สำเร็จ ไม่ได้รับไฟล์บันทึกภายในเวลาที่กำหนด': 'Preparation failed. No recording arrived in time.', เตรียมไฟล์ใหม่: 'Prepare again', เลิกเผยแพร่: 'Unpublish', อนุมัติและเผยแพร่: 'Approve and publish', ยังไม่มีไฟล์ให้ตรวจ: 'No files to review yet', ระบบกำลังรับไฟล์จากการบันทึก: 'Receiving files from the recorder',
}

const WORDS: Record<string, string> = {
  รับชม: 'watching', ชิ้น: 'pieces', ค่าย: 'camp', วันนี้: 'Today', ครั้ง: 'times', บาท: 'THB', เปอร์เซ็นต์: 'percent', 'ซม.': 'cm', พบ: 'vs', ของขวัญจากผู้ชมรวม: 'Fan gifts total',
  คะแนนเฉลี่ยรายยก: 'Average score by round', คะแนนเฉลี่ย: 'average score', อาวุธเข้าเป้าเฉลี่ยต่อไฟต์: 'Average strikes per fight',
}

// Single letters shown in avatar circles.
const INITIALS: Record<string, string> = { ก: 'K', น: 'N', บ: 'B', ป: 'P', พ: 'P', ฟ: 'F', ม: 'M', ร: 'R', ล: 'L', ซ: 'S', ส: 'S' }

const PHRASES: Record<string, string> = { ...WORDS, ...DATA, ...CAMPS, ...NAMES, ...UI }

const MONTHS: Record<string, string> = {
  'ม.ค.': 'Jan', 'ก.พ.': 'Feb', 'มี.ค.': 'Mar', 'เม.ย.': 'Apr', 'พ.ค.': 'May', 'มิ.ย.': 'Jun',
  'ก.ค.': 'Jul', 'ส.ค.': 'Aug', 'ก.ย.': 'Sep', 'ต.ค.': 'Oct', 'พ.ย.': 'Nov', 'ธ.ค.': 'Dec',
}
const DAYS: Record<string, string> = { 'อา.': 'Sun', 'จ.': 'Mon', 'อ.': 'Tue', 'พ.': 'Wed', 'พฤ.': 'Thu', 'ศ.': 'Fri', 'ส.': 'Sat' }

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const anyOf = (keys: string[]) => [...keys].sort((a, b) => b.length - a.length).map(escape).join('|')

const DATE = new RegExp(`(?:(${anyOf(Object.keys(DAYS))}) )?(\\d{1,2}) (${anyOf(Object.keys(MONTHS))})(?: (25\\d\\d))?`, 'g')
const THAI = /[\u0E01-\u0E3A\u0E40-\u0E5B]/
const WORD = new RegExp(anyOf(Object.keys(PHRASES).filter((k) => k.length > 1)), 'g')
const toCE = (year: string) => String(Number(year) - 543)

// Each $n is a capture translated on its own, so names inside sentences come out right.
const PATTERNS: [RegExp, string][] = [
  [/^อันดับ (\d+) จาก (\d+) ของ(.+)$/, 'Ranked $1 of $2 in $3'],
  [/^อันดับ (\d+) (.+)$/, 'No. $1 $2'],
  [/^อันดับ (\d+)$/, 'Rank $1'],
  [/^ล่าสุด (.+)$/, 'Latest $1'],
  [/^ชนะ (\d+) แพ้ (\d+) เสมอ (\d+)$/, '$1W $2L $3D'],
  [/^ชนะ (\d+) แพ้ (\d+)$/, '$1W $2L'],
  [/^ซื้อสิทธิ์รับชม ([\d,]+) บาท$/, 'Buy access THB $1'],
  [/^ซื้อ (.+) ราคา ([\d,]+) บาท เปิดในแท็บใหม่$/, 'Buy $1 for THB $2, opens in a new tab'],
  [/^(.+) ([\d,]+) บาท$/, '$1 THB $2'],
  [/^([\d,]+) บาท$/, 'THB $1'],
  [/^(\d+) ปี$/, '$1 yrs'],
  [/^(\d+) ซม\.$/, '$1 cm'],
  [/^(\d+) ยก$/, '$1 rounds'],
  [/^กำหนด (\d+) ยก$/, '$1 rounds'],
  [/^(.+) กำหนด (\d+) ยก ที่(.+)$/, '$1, $2 rounds at $3'],
  [/^ยก (\d+)\s*\/\s*(\d+)(?: (\d\d:\d\d))?$/, 'Round $1/$2 $3'],
  [/^ยกที่ (\d+) \/ (\d+)$/, 'Round $1 / $2'],
  [/^ยก (\d+)$/, 'Round $1'],
  [/^คะแนนรวม AI จาก (\d+) ยกที่จบแล้ว$/, 'AI total from $1 finished rounds'],
  [/^(.+) น็อก (.+) ยก (\d+)$/, '$1 knocks out $2 in round $3'],
  [/^([\d.]+[KM]?) ครั้ง$/, '$1 views'],
  [/^([\d.]+[KM]?) รับชม(?:อยู่)?$/, '$1 watching'],
  [/^ผู้ติดตาม (.+) คน$/, '$1 followers'],
  [/^(\d+) วันที่แล้ว$/, '$1 days ago'],
  [/^(\d+) ชั่วโมงที่แล้ว$/, '$1 hours ago'],
  [/^(\d+) วินาที$/, '$1 sec'],
  [/^(\d+) ไฟล์$/, '$1 files'],
  [/^(\d+) คน$/, '$1 fighters'],
  [/^รวม ([\d,]+) ชิ้น$/, '$1 gifts'],
  [/^เริ่ม (.+)$/, 'Starts $1'],
  [/^ได้รับ (.+)$/, 'Granted $1'],
  [/^มีสิทธิ์รับชมแล้ว รอเริ่ม (.+)$/, 'You have access. Starts $1'],
  [/^โปรไฟล์ (.+)$/, '$1 profile'],
  [/^ดูโปรไฟล์ (.+)$/, 'View $1 profile'],
  [/^เชียร์ (.+)$/, 'Cheer for $1'],
  [/^ส่ง (\S+) (.+) ให้ (.+) ใช้ ([\d,]+) Credit$/, 'Send $1 $2 to $3 for $4 Credit'],
  [/^ส่ง (\S+) (.+) ให้ (.+)$/, 'sent $1 $2 to $3'],
  [/^ส่ง(.+) ([\d,]+) Credit$/, 'Send $1, $2 Credit'],
  [/^ส่ง(.+)ให้ (.+)$/, 'Sent $1 to $2'],
  [/^Credit ไม่พอสำหรับ(.+)$/, 'Not enough Credit for $1'],
  [/^เฉลี่ยในรุ่น (.+) ครั้งต่อไฟต์$/, 'Division average $1 per fight'],
  [/^เฉลี่ยในรุ่น (.+)$/, 'Division average $1'],
  [/^(.+) จาก (\d+) ไฟต์$/, '$1 in $2 fights'],
  [/^(\d+) ครั้งจากการชนะ$/, '$1 knockout wins'],
  [/^ผล (\d+) ไฟต์ล่าสุด$/, 'Last $1 fights'],
  [/^เคยเจอกัน (\d+) ครั้ง (.+) ชนะ (\d+) แพ้ (\d+) เสมอ (\d+)$/, 'Met $1 times. $2 record: $3W $4L $5D'],
  [/^ยืนยันหยุด (.+) vs (.+)\? ทำแล้วเริ่มสัญญาณเดิมต่อไม่ได้$/, "Stop $1 vs $2? The signal can't resume after this."],
  [/^ส่วนที่ (\d+) \((.+)\)$/, 'Part $1 ($2)'],
  [/^สัญญาณหลุดระหว่างรายการ วิดีโอจึงมี (\d+) ส่วน และเล่นต่อกันอัตโนมัติ$/, 'The signal dropped during the event, so the video has $1 parts that play in a row.'],
  [/^สัญญาณหลุดระหว่างรายการ ไฟล์จึงแยกเป็น (\d+) ส่วน$/, 'The signal dropped during the event, so the recording has $1 parts.'],
  [/^กำลังตรวจไฟล์ (.+)$/, 'Reviewing file $1'],
  [/^ความยาว (.+)$/, 'Length $1'],
  [/^(.+) กำลังชกกับ (.+)$/, '$1 is fighting $2 now'],
  [/^ไฟต์ถัดไป พบ (.+?) ((?:[A-Z][a-z]+ ).+)$/, 'Next fight vs $1, $2'],
  [/^ชกครั้งถัดไป (.+)$/, 'Next fight $1'],
  [/^พบ (.+)$/, 'vs $1'],
  [/^ความคิดเห็น (\d+) รายการ$/, '$1 comments'],
  [/^ถูกใจความคิดเห็นของ (.+)$/, 'Like comment by $1'],
  [/^ถูกใจ (.+)$/, 'Like $1'],
  [/^สัมภาษณ์หลังไฟต์ (.+)$/, 'Post-fight interview: $1'],
  [/^(.+) เปิดใจก่อนขึ้นเวที$/, '$1 opens up before the fight'],
  [/^หนึ่งวันกับ (.+)$/, 'A day with $1'],
  [/^(.+) ตอบทุกคำถามจากแฟนมวย$/, '$1 answers fan questions'],
  [/^(.+) จาก(.+) พูดถึงการเตรียมตัว สไตล์(.+) และเป้าหมายในปีนี้$/, '$1 of $2 talks about preparation, fighting style ($3), and goals for this year.'],
  [/^(.+) ตามติดการซ้อมหนึ่งวันกับ(.+) ที่จังหวัด(.+)$/, '$1 Follow a day of training with $2 in $3.'],
  [/^(.+) จาก(.+) สอนทีละขั้นตอน$/, '$1 of $2 teaches it step by step.'],
  [/^(.+) เป็นนักมวยสาย(.+)จาก(.+) ลงแข่ง(.+) จุดเด่นคือการคุมจังหวะและเดินหน้ากดดันคู่ต่อสู้$/, '$1 is a $2 from $3 competing at $4, known for controlling the pace and pressing forward.'],
  [/^เบื้องหลัง(.+)$/, 'Inside $1'],
  [/^เบื้องหลัง$/, 'Inside'],
  [/^รองแชมป์(.+) (สนามมวย.+)$/, '$1 runner-up, $2'],
  [/^แชมป์(.+) (สนามมวย.+)$/, '$1 champion, $2'],
  [/^นักมวยดาวรุ่ง (.+)$/, 'Rising star, $1'],
  [/^ธงชาติ(.+)$/, 'Flag of $1'],
  [/^รูป (.+)$/, 'Photo of $1'],
  [/^เลื่อน(.+)ไปทาง(ซ้าย|ขวา)$/, 'Scroll $1 $2'],
  [/^AI SKELETON ช้ากว่าสด (\d+) วินาที$/, 'AI SKELETON $1 sec behind live'],
  [/^พ\.ศ\. (\d+)$/, '$1'],
]

function convert(text: string): string {
  if (text in PHRASES) return PHRASES[text]
  if (text in INITIALS) return INITIALS[text]
  if (text === 'ซ้าย') return 'left'
  if (text === 'ขวา') return 'right'
  if (!THAI.test(text)) return text

  for (const [pattern, template] of PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const out = template.replace(/\$(\d)/g, (_, n) => {
        const part = match[Number(n)] ?? ''
        return text.startsWith('พ.ศ.') ? toCE(part) : convert(part)
      })
      return out.trim()
    }
  }

  const parts = text.split(/( · |, )/)
  if (parts.length > 1) return parts.map((p, i) => (i % 2 ? p : convert(p))).join('')

  return text.replace(WORD, (word) => ` ${PHRASES[word]} `).replace(/\s+/g, ' ').replace(/ ([,.?!])/g, '$1').trim()
}

const cache = new Map<string, string>()

export function translate(source: string) {
  const known = cache.get(source)
  if (known !== undefined) return known
  const [, lead, core, trail] = source.match(/^(\s*)([\s\S]*?)(\s*)$/)!
  const dated = core
    .replace(/(\d\d:\d\d) น\./g, '$1')
    .replace(DATE, (_, day, date, month, year) => [DAYS[day], date, MONTHS[month], year && toCE(year)].filter(Boolean).join(' '))
  const out = /^25\d\d$/.test(dated) ? toCE(dated) : convert(dated)
  const result = lead + out + trail
  cache.set(source, result)
  return result
}

export const hasThai = (text: string) => THAI.test(text)
