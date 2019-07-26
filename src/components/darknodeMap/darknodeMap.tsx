import React from "react";
import {
    ComposableMap, Geographies, Geography, Marker, Markers, ZoomableGroup,
} from "react-simple-maps";
import { Link } from "react-router-dom";

import { MapContainer } from "./mapContainer";
import MapJSON from "./world-50m.json";

export const DarknodeMap = () => {
    const counter = MapContainer.useContainer();
    return (
        <div className="map container">
            <ComposableMap
                className="map--world"
                projectionConfig={{ scale: 205 }}
                width={980}
                height={551}
                style={{
                    width: "100%",
                    height: "auto",
                }}
            >
                <ZoomableGroup center={[0, 20]} disablePanning>
                    <Geographies geography={MapJSON}>
                        {(geographies, projection) =>
                            geographies.map((geography: any, i) =>
                                // Don't render Antarctica
                                (geography as { id: string }).id !== "ATA" && (
                                    <Geography
                                        key={i}
                                        geography={geography}
                                        projection={projection}
                                        style={{
                                            default: {
                                                fill: "#00244d",
                                                stroke: "#00244d",
                                                strokeWidth: 0,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#00244d",
                                                stroke: "#00244d",
                                                strokeWidth: 0,
                                                outline: "none",
                                            },
                                            pressed: {
                                                fill: "#00244d",
                                                stroke: "#00244d",
                                                strokeWidth: 0,
                                                outline: "none",
                                            },
                                        }}
                                    />
                                ))}
                    </Geographies>
                    <Markers>
                        {counter.darknodes.map((darknode, i) => <Marker key={i} marker={darknode}>
                            <Link to={`/darknode/${darknode.darknodeID}`}>
                                <circle
                                    cx={0}
                                    cy={0}
                                    r={5}
                                />
                            </Link>
                        </Marker>)}
                    </Markers>
                </ZoomableGroup>
            </ComposableMap>
        </div >
    );
};
