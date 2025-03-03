import styles from "./SavedLocsButton.module.css"

function SavedLocsButton() {
    return(<button style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '10px',
        width: '210px'
      }}
    className={styles.button}>SAVED LOCATIONS</button>)
}
export default SavedLocsButton