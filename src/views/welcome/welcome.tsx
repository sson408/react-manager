import styles from './index.module.less'
export default function WelcomePage() {
  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.subTitle}>Welcome</div>
        <div className={styles.title}>Dashboard</div>
      </div>
      <div className={styles.img}></div>
    </div>
  )
}
