import React from 'react';
import styles from './MemberList.module.css';
import { Avatar } from '../../components/Avatar/Avatar';
import { Crown } from 'lucide-react';

const members = [
  { id: '1', name: 'Username', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Username', status: 'online', isOwner: true, subtitle: 'В сети' },
  { id: '2', name: 'Shadow', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Shadow', status: 'online', isOwner: false, subtitle: 'В сети' },
  { id: '3', name: 'Luna', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Luna', status: 'dnd', isOwner: false, subtitle: 'Не беспокоить' },
  { id: '4', name: 'Max', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Max', status: 'online', isOwner: false, subtitle: 'В сети' },
];

export const MemberList: React.FC = () => {
  return (
    <aside className={styles.memberList}>
      <h3 className={styles.categoryTitle}>УЧАСТНИКИ — {members.length}</h3>
      <div className={styles.members}>
        {members.map(member => (
          <div key={member.id} className={styles.memberItem}>
            <Avatar src={member.avatar} status={member.status as any} size="md" />
            <div className={styles.memberInfo}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{member.name}</span>
                {member.isOwner && <Crown size={12} className={styles.ownerIcon} />}
              </div>
              <div className={styles.subtitle}>{member.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
