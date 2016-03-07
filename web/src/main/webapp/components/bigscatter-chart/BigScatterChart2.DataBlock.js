(function(global, $) {
	'use strict';
	function DataBlock( oData, oPropertyIndex, oTypeInfo ) {
		this._initData( oData );
		this._splitDataByAgent( oPropertyIndex, oTypeInfo );
	}
	DataBlock.prototype._initData = function( oData ) {
		this._from = oData.from;
		this._to = oData.to;
		this._resultFrom = oData.resultFrom;
		this._resultTo = oData.resultTo;
		this._oAgentMetaInfo = oData.scatter.metadata;
		this._aAllData = oData.scatter.dotList;

		this._oAgentData = {};
		this._oCountOfType = {};
	};
	DataBlock.prototype._splitDataByAgent = function( oPropertyIndex, oTypeInfo ) {
		var self = this;
		this._oPropertyIndex = oPropertyIndex;
		this._oTypeInfo = oTypeInfo;
		$.each( this._oAgentMetaInfo, function( key, oValue ) {
			var agentName = oValue[0];
			self._oAgentData[agentName] = [];
			self._oCountOfType[agentName] = {};
			$.each( oTypeInfo, function( key, aValue ) {
				self._oCountOfType[agentName][aValue[0]] = 0;
			});
		});
		var minY = Number.MAX_VALUE;
		var maxY = 0;

		$.each( this._aAllData, function( index, aValue ) {
			var agentName = self._getAgentName( aValue[2] + "" );
			minY = Math.min( aValue[1], minY );
			maxY = Math.max( aValue[1], maxY );
			aValue[0] += self._from;
			self._oAgentData[ agentName ].push( aValue );
			self._oCountOfType[agentName][ oTypeInfo[aValue[oPropertyIndex.type] + "" ][0] ]++;
		});

		this._minX = this._aAllData[0][oPropertyIndex.x];
		this._maxX = this._aAllData[this._aAllData.length - 1][oPropertyIndex.x];
		this._minY = minY;
		this._maxY = maxY;
	};
	DataBlock.prototype._getAgentName = function( key ) {
		return this._oAgentMetaInfo[ key ][0];
	};
	DataBlock.prototype.getDataByAgent = function( agent, index ) {
		return this._oAgentData[agent][index];
	};
	DataBlock.prototype.getData = function( index ) {
		return this._aAllData[index];
	};
	DataBlock.prototype.count = function() {
		return this._aAllData.length;
	};
	DataBlock.prototype.countByAgent = function( agent ) {
		if ( this._oAgentData[agent] ) {
			return this._oAgentData[agent].length;
		} else {
			return 0;
		}
	};
	DataBlock.prototype.getCount = function( agentName, type, minX, maxX ) {
		if ( arguments.length === 2 || minX <= this._minX && this._maxX <= maxX ) {
			if (this._oCountOfType[agentName]) {
				return this._oCountOfType[agentName][type];
			} else {
				return 0;
			}
		} else {
			return this._getRealtimeCount( agentName, type, minX, maxX );
		}
	};
	DataBlock.prototype._getRealtimeCount = function( agentName, type, minX, maxX ) {
		var self = this;
		var sum = 0;
		$.each( this._aAllData, function( index, aValue ) {
			if ( agentName === self._getAgentName( aValue[2] + "" ) ) {
				if ( type === self._oTypeInfo[aValue[self._oPropertyIndex.type] + ""] ) {
					if ( aValue[0] >= minX && aValue[1] <= maxX ) {
						sum++;
					}
				}
			}
		});
		return sum;
	};
	DataBlock.prototype.getTransactionID = function( aDataBlock ) {
		var oMeta = this._oAgentMetaInfo[ aDataBlock[this._oPropertyIndex.meta] + "" ];
		return oMeta[1] + "^" + oMeta[2] + "^" + aDataBlock[this._oPropertyIndex.transactionId];
	};
	DataBlock.prototype.getAgentName = function( aDataBlock ) {
		var oMeta = this._oAgentMetaInfo[ aDataBlock[this._oPropertyIndex.meta] + "" ];
		return oMeta[0];
	};

	global.BigScatterChart2.DataBlock = DataBlock;
})(window, jQuery);