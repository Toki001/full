const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }
    const notificationStyle = {
        color: type === 'success' ? 'green' : 'red',
        background: 'lightgrey',
        fontSize: 20,
        border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    }

    return (
        <div style={notificationStyle}>{message}</div>
    )
}

export default Notification