# เทคโนโลยีเพิ่มเติมเพื่อเพิ่ม Performance

## Library มาตรฐานของ NestJS

### @nestjs/config
ใช้จัดการ environment variables และการตั้งค่าแอปพลิเคชันอย่างมีประสิทธิภาพ:
- โหลดตัวแปรจาก .env file และตรวจสอบความถูกต้อง
- ช่วยให้แอปพลิเคชันรันได้บนหลายสภาพแวดล้อม (development, staging, production)
- รองรับการตรวจสอบความถูกต้องของตัวแปรด้วย Joi

### class-validator และ class-transformer
เพิ่มความปลอดภัยด้วยการตรวจสอบข้อมูลที่รับเข้ามา:
- ลดความเสี่ยงจาก malicious input
- ตรวจสอบ input ได้อัตโนมัติด้วย DTO validation
- ตรวจสอบรูปแบบข้อมูลได้หลากหลาย เช่น email, UUID, ความยาวข้อความ

### @nestjs/jwt และ Guards
เพิ่มความปลอดภัยให้กับ API ด้วยการยืนยันตัวตน:
- ป้องกันการเข้าถึง API โดยไม่ได้รับอนุญาต
- แยกส่วนโค้ดการตรวจสอบสิทธิ์ออกจากส่วน business logic
- รองรับการตรวจสอบสิทธิ์แบบ Role-based

### Fastify Adapter
ใช้ Fastify แทน Express เพื่อเพิ่มความเร็วในการตอบสนอง:
- รองรับ requests ต่อวินาทีสูงกว่า Express
- ใช้หน่วยความจำน้อยกว่า
- ประสิทธิภาพในการ serialize/deserialize JSON ดีกว่า

