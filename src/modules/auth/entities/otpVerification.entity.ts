import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('otp_verifications') // Matches table name in DB
export class OtpVerification {
  @PrimaryGeneratedColumn('uuid') // Use UUID instead of number
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 6 }) // Ensures max 6 characters
  otp: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' }) // Ensures timestamp type
  created_at: Date;
}
