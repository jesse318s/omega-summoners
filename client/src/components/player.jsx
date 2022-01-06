function Player({ player }) {
    return (
        <div className="color_white">
            <img src={player.avatarPath}
                alt={player.name}
                className="player_avatar"
                width="96"
                height="96" />
            <h4>{player.name}</h4>
            <h5>
                Lvl. {Math.floor(Math.sqrt(player.experience) * 0.25)} | {player.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XP
                <div className="progress_bar_container">
                    <div className="progress_bar"
                        style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                </div>
            </h5>
            <h5>Drachmas: {player.drachmas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {"\u25C9"}</h5>
        </div>
    );
}

export default Player;

