import styles from "./CFButton.module.css"

function SavedLocsButton() {
    return(<button style={{
        position: 'absolute',
        top: '55px',
        right: '10px',
        padding: '10px',
        width: '210px'
      }}
    className={styles.button}>FAHRENHEIT / CELSIUS</button>)
}
export default SavedLocsButton