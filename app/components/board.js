angular.module('pentominoApp')

// The terminal (input / output)
.directive('board', [function() {
	return {
		restrict: 'A',
        scope: false,
		templateUrl: 'app/components/board.html',
        link: function($scope) {
            $scope.board = {
                fields : [],
                partSize : 40,
                brdType : 'square',
                brdTypes : {
                    'square' : {
                        w : 8,
                        h : 8
                    },
                    'rectangle' : {
                        w : 6,
                        h : 10
                    }
                },
                solved : false,
                newSolution : false,
                width : function() {
                    return $scope.board.brdTypes[$scope.board.brdType].w;
                },
                height : function() {
                    return $scope.board.brdTypes[$scope.board.brdType].h;
                },
                onBoard : function(x,y) {
                    return (x >= 0) && (x < this.width()) &&
                        (y >= 0) && (y < this.height());
                },
                theBoardCss : function () {
                    return {
                        'width':this.width()*this.partSize+'px',
                        'height':this.height()*this.partSize+'px'
                    }
                },
                setBoardFields : function() {
                    var w = $scope.board.width();
                    var h = $scope.board.height();
                    $scope.board.fields = [];
                    for (var y = 0; y < h; y++) {
                        $scope.board.fields.push([]);
                        for (var x = 0; x < w; x++) {
                            $scope.board.fields[y].push(0);
                        }
                    };
                },
                registerPiece : function(pentomino,onOff) {
                    var x, y;
                    for (var i = 0; i < pentomino.faces[pentomino.face].length; i++) {
                        x = pentomino.faces[pentomino.face][i][0]+pentomino.position.x;
                        y = pentomino.faces[pentomino.face][i][1]+pentomino.position.y;
                        if (this.onBoard(x,y)) {
                            this.fields[y][x] += onOff;
                        }

                    }
                },
                registerAllPieces : function() {
                    for (var i = 0; i < $scope.pentominos.length; i++) {
                        this.registerPiece($scope.pentominos[i],1);
                    }
                },
                boardIsFull : function() {
                    for (var y = 0; y < $scope.board.height(); y++) {
                        for (var x = 0; x < $scope.board.width(); x++) {
                            if ($scope.board.fields[y][x] !== 1) {
                                return false;
                            }
                        }
                    }
                    return true;
                },
                pentomino2string : function (pentomino) {
                    if (pentomino) {
                        return '#' + pentomino.name + pentomino.face + pentomino.position.x + pentomino.position.y;
                    } else {
                        return 'false';
                    }
                },
                solution2String : function () {
                    var solution = $scope.pentominos;
                    var solutionString = "";
                    for (var i = 0; i < solution.length; i++) {
                        solutionString += $scope.board.pentomino2string(solution[i]);
                    }
                    return solutionString;
                },
                hasFlipRotateSibling : function (solution) {
                    for (var flip = 0; flip < 2; flip++) {
                        for (var rotation = 0; rotation < 4; rotation++) {
                            $scope.methods.rotateBoard();
                        }
                    }
                },
                isNewSolution : function() {
                    var solutionString = $scope.board.solution2String();
                    var isNewSolution = true;
                    for (var i = 0; i < $scope.solutions[$scope.board.brdType].length; i++) {
                        isNewSolution = isNewSolution && (solutions[$scope.board.brdType][i] !== solutionString);
                        if (!isNewSolution) return i;
                    }
                    return solutionString;
                },
                isSolved : function() {
                    var saveResult;
                    var solved = $scope.board.boardIsFull();
                    var solutionResult = $scope.board.isNewSolution();
                    if (solved) {
                        this.solved = solved;
                        if (!isNaN(solutionResult)) {
                            $scope.currentSolution = solutionResult;
                            this.newSolution = false;
                        } else {
                            $scope.saveSolution();
                            $scope.solutions[$scope.board.brdType].push(solutionResult);
                            this.newSolution = true;
                        }
                    }
                },
                cleanBoard : function() {
                    var w = $scope.board.width();
                    var h = $scope.board.height();
                    $scope.board.solved = false;
                    $scope.board.fields = [];
                    for (var y = 0; y < h; y++) {
                        $scope.board.fields.push([]);
                        for (var x = 0; x < w; x++) {
                            $scope.board.fields[y].push(0);
                        }
                    };
                }
            };
        }
	};
}]);
