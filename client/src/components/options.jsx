import { updateUser } from '../services/userServices';

function Options({ Userfront, player, optionsStatus, nameOptionStatus, setNameOptionStatus, avatarOptionStatus, setAvatarOptionStatus, creatureStatsStatus, loadAsyncDataPlayer }) {

    // toggles display creature stats in database
    const toggleDisplayCreatureStats = async () => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, displayCreatureStats: !creatureStatsStatus });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player name in database
    const selectName = async (e) => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, name: e });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player avatar path in database
    const selectAvatar = async (avatarPath) => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, avatarPath: avatarPath });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {optionsStatus ?
                <div className="color_white">
                    <h3>Game Options</h3>
                    <button className="game_button margin_small" onClick={() => { toggleDisplayCreatureStats() }}>Display Summon Stats
                        {player.displayCreatureStats ? " - ON" : " - OFF"}</button>
                    <h3>Player Options</h3>
                    <button className="game_button margin_small" onClick={() => { setAvatarOptionStatus(!avatarOptionStatus); setNameOptionStatus(false); }}> Change Avatar</button>
                    <button className="game_button margin_small" onClick={() => { setNameOptionStatus(!nameOptionStatus); setAvatarOptionStatus(false); }}>Change Name</button>
                    {nameOptionStatus && !avatarOptionStatus ? <div>
                        <label htmlFor="name">Player name:&nbsp;</label>
                        <input className="margin_small" type="text" name="name" placeholder={player.name} /><br />
                        <button className="game_button_small margin_small" onClick={() => selectName(document.querySelector("input[name='name']").value)}>Submit Name</button>
                    </div>
                        : null}
                    {avatarOptionStatus && !nameOptionStatus ? <div>
                        <div className="inline_flex">
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="96" height="96" />
                                <p className="avatar_option">Avatar 1</p></div>
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="96" height="96" />
                                <p className="avatar_option">Avatar 2</p></div>
                        </div><br />
                        <div className="inline_flex">
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="96" height="96" />
                                <p className="avatar_option">Avatar 3</p></div>
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="96" height="96" />
                                <p className="avatar_option">Avatar 4</p></div>
                        </div><br />
                        <div className="inline_flex">
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="96" height="96" />
                                <p className="avatar_option">Avatar 5</p></div>
                            <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                                <img className="player_avatar avatar_option" src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="96" height="96" />
                                <p className="avatar_option">Avatar 6</p></div>
                        </div>
                    </div>
                        : null}
                </div>
                : null}
        </>
    )
}

export default Options;