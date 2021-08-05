import _ from "lodash";
import React from "react";
import {ContainerBase} from "../../../lib/component";
import * as A from "../../../shared/actions";
import Alert from "@material-ui/lab/Alert/Alert";
import Button from "@material-ui/core/Button";
import {List, ListItem} from "@material-ui/core";
import {map} from "rxjs/operators";

export default class GameSetup extends ContainerBase {
    constructor(props) {
        super(props);

        this._setScoreLimit = (e) => {
            if (!this.state.opSetOptions.can) {
                return;
            }
            this.request(A.gameSetOptions(this.state.game.id, {
                ...this.state.game.options,
                scoreLimit: parseInt(e.target.value)
            }));
        };

        this._toggleSet = (set) => {
            const {opSetOptions, game: {options, id}} = this.state;
            if (!opSetOptions.can)
                return;

            let newSets = set.isSelected ? options.sets.filter(setId => setId != set.name) : options.sets.concat(set.id);
            const changedOptions = {...options, sets: newSets};
            this.request(A.gameSetOptions(this.state.game.id, changedOptions));
        };

        this._startGame = (e) => {
            e.preventDefault();
            const {opStart, game: {id}} = this.state;
            if (!opStart.can) {
                return;
            }

            this.request(A.gameStart(id));
        };
    }

    componentWillMount() {
        const {stores: {app, game}} = this.context;
        this.subscribe(app.view$.pipe(map(v => v.sets)), sets => this.setState({sets}));
        this.subscribe(game.view$, game => this.setState({game}));
        this.subscribe(game.opSetOptions$, opSetOptions => this.setState({opSetOptions}));
        this.subscribe(game.opStart$, opStart => this.setState({opStart}));
    }

    render() {
        const {sets, game: {options}, opSetOptions, opStart} = this.state;
        const setList = sets.map(set => ({
            id: set.id,
            name: set.name,
            isSelected: options.sets.includes(set.id)
        }));
        const disabled = !opSetOptions.can || opSetOptions.inProgress || opStart.inProgress;
        const error = opStart.error || opSetOptions.error;
        return (
            <section id="game-setup">
                <h1>Game Options </h1>
                {!error ? null :
                    <Alert variant="filled" severity="error" style={{backgroundColor: "#cf1b1b"}}>{error}</Alert>}
                <form>
                    <div className="form-group">
                        <label>Score Limit:</label>
                        <select value={options.scoreLimit} onChange={this._setScoreLimit} disabled={disabled}
                                className="custom-select">
                            {
                                _.range(4, 50).map(i =>
                                    <option value={i} key={i}>{i}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Sets : </label>
                        <SetList sets={setList} toggleSet={this._toggleSet}/>
                    </div>
                    <Button onClick={this._startGame} disabled={disabled} fullWidth variant="outlined"
                            style={{backgroundColor: "#5cb85c", color: "white"}}>Start Game</Button>
                </form>
            </section>
        );
    }
}

function SetList({sets, toggleSet}) {
    return (
        <List className="list-group">
            {sets.map(set => <ListItem key={set.id}
                                       className={set.isSelected ? "list-group-item active" : "list-group-item"}
                                       onClick={() => toggleSet(set)}>{set.name}</ListItem>)}
        </List>
    );
}