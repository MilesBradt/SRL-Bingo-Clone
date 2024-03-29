function bingosetup() {

    $('.popout').click(function () {
        var mode = null;
        var line = $(this).attr('id');
        var name = $(this).html();
        var items = [];
        var cells = $('#bingo .' + line);
        for (var i = 0; i < 5; i++) {
            items.push($(cells[i]).html());
        };
        window.open('http://www.speedrunslive.com/tools/bingo-popout.html#' + name + '=' + items.join(';;;'), "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=220, height=460");
    });

    $("#bingo tr td:not(.popout), #selected td").toggle(
        function () {
            $(this).addClass("greensquare");
        },
        function () {
            $(this).addClass("redsquare").removeClass("greensquare");
        },
        function () {
            $(this).removeClass("redsquare");
        }

    );

    $("#row1").hover(function () {
        $(".row1").addClass("hover");
    }, function () {
        $(".row1").removeClass("hover");
    });
    $("#row2").hover(function () {
        $(".row2").addClass("hover");
    }, function () {
        $(".row2").removeClass("hover");
    });
    $("#row3").hover(function () {
        $(".row3").addClass("hover");
    }, function () {
        $(".row3").removeClass("hover");
    });
    $("#row4").hover(function () {
        $(".row4").addClass("hover");
    }, function () {
        $(".row4").removeClass("hover");
    });
    $("#row5").hover(function () {
        $(".row5").addClass("hover");
    }, function () {
        $(".row5").removeClass("hover");
    });

    $("#col1").hover(function () {
        $(".col1").addClass("hover");
    }, function () {
        $(".col1").removeClass("hover");
    });
    $("#col2").hover(function () {
        $(".col2").addClass("hover");
    }, function () {
        $(".col2").removeClass("hover");
    });
    $("#col3").hover(function () {
        $(".col3").addClass("hover");
    }, function () {
        $(".col3").removeClass("hover");
    });
    $("#col4").hover(function () {
        $(".col4").addClass("hover");
    }, function () {
        $(".col4").removeClass("hover");
    });
    $("#col5").hover(function () {
        $(".col5").addClass("hover");
    }, function () {
        $(".col5").removeClass("hover");
    });

    $("#tlbr").hover(function () {
        $(".tlbr").addClass("hover");
    }, function () {
        $(".tlbr").removeClass("hover");
    });
    $("#bltr").hover(function () {
        $(".bltr").addClass("hover");
    }, function () {
        $(".bltr").removeClass("hover");
    });

    var initialOpts = {
        seed: getUrlParameter('seed') || Math.ceil(999999 * Math.random()).toString(),
        mode: getUrlParameter('mode') || 'normal',
        lang: getUrlParameter('lang') || 'name'
    };

    var prettyMode = {
        'blackout': 'Blackout',
        'normal': 'Normal',
        'short': 'Short',
        'meme' : 'Meme',
        'beta' : 'Beta',
        'long': 'Long'
    };

    var bingoFunc = ootBingoGenerator;

    // if debug was requested, initialize all of the debug panels
    if (getUrlParameter('debug')) {
        $("#info-panel").hide();
        var $debugPanel = $("#debug-panel");
        $debugPanel.show();

        $("#generate-random").on("click", function () {
            generateCard(undefined);
        });

        $("#generate-with-seed").on("click", function () {
            var seed = "" + $("#seed-field").val();
            generateCard(seed);
        });

        $debugPanel.find(".debug-row").each(function () {
            var rowClass = $(this).attr("row-class");
            var $row = $("." + rowClass);

            $(this).hover(function () {
                $row.addClass("hover");
            }, function () {
                $row.removeClass("hover");
            });
        });

        // fill in the difficulties of the goals if they're not set already
        if (bingoList[1] && !bingoList[1][0].difficulty) {
            for (var difficulty = 1; difficulty <= 25; difficulty++) {
                for (var i = 0; i < bingoList[difficulty].length; i++) {
                    bingoList[difficulty][i].difficulty = difficulty;
                }
            }
        }
    }

    // set this to be the override goal names if you want
    var override = [];

    if (override.length !== 0) {
        setOverrideCard(override);
    } else {
        generateCard(initialOpts.seed);
    }

    function generateCard(seed) {
        // make a copy of the initial options to use as a base
        var opts = JSON.parse(JSON.stringify(initialOpts));

        if (!seed) {
            Math.seedrandom(new Date().getTime());
            seed = Math.ceil(999999 * Math.random()).toString();
        }
        opts.seed = seed;

        var bingoBoard = bingoFunc(bingoList, opts);

        if (bingoBoard) {
            setBoard(bingoBoard);
            
            var cardType = prettyMode[opts.mode];

            if (cardType === 'Meme') {
                bingoList = memeBingoList
            } else if (cardType === 'Beta') {
                bingoList = betaBingoList
            }
        
            $("#results-header").html("<p><span class='bingo-info'>OoT Bingo: </span><strong>" + bingoList["info"].version + 
            "</strong>&emsp;<span class='bingo-info'>Seed: </span><strong>" + opts.seed + "</strong>&emsp;<span class='bingo-info'>Card type: </span><strong>" + cardType + "</strong></p>");
        } else {
            alert("Card could not be generated");
        }

        if (getUrlParameter("debug")) {
            var bingoGenerator = new BingoGenerator(bingoList, opts);
            bingoGenerator.bingoBoard = bingoBoard;
            setDebugInfo(bingoGenerator);
        }
    }

    function setOverrideCard(overrideGoalNames) {
        var generator = new BingoGenerator(bingoList, initialOpts);

        // generate the expected difficulty stuff so that debug output works
        var overrideBoard = generator.generateMagicSquare();
        for (var i = 1; i <= 25; i++) {
            var name = overrideGoalNames[i - 1];

            var goal = generator.goalsByName[name];
            if (!goal) {
                alert("Can't find goal: " + name)
            }
            var square = JSON.parse(JSON.stringify(goal));
            square.goal = goal;

            // preserve the magic square information initially present in the board
            overrideBoard[i] = $.extend(overrideBoard[i], square);
        }

        overrideBoard.meta = {
            iterations: 0
        };
        generator.bingoBoard = overrideBoard;

        setBoard(overrideBoard);
        setDebugInfo(generator);
    }

    function setBoard(board) {
        for (i = 1; i <= 25; i++) {
            $('#slot' + i).html(board[i].name);
        }
    }

    function setDebugInfo(bingoGenerator) {
        var bingoBoard = bingoGenerator.bingoBoard;

        $debugPanel.find("#board-seed").html(bingoGenerator.seed);
        $debugPanel.find("#max-allowed-synergy").html(bingoGenerator.maximumSynergy);
        $debugPanel.find("#max-allowed-spill").html(bingoGenerator.maximumSpill);
        $debugPanel.find("#generator-iterations").html(bingoBoard.meta.iterations);

        var $rowInfoTable = $debugPanel.find("#row-info");
        var $rowSynergyTable = $debugPanel.find("#row-types");
        if (bingoBoard) {
            for (var row in INDICES_PER_ROW) {
                var rowSynergy = bingoGenerator.evaluateRow(row);

                var rowSquares = bingoGenerator.getOtherSquares(row);
                var rowRawTime = bingoGenerator.baselineTime;
                var rowSkill = 0;
                for (var i = 0; i < rowSquares.length; i++) {
                    rowRawTime += rowSquares[i].goal.time;
                    rowSkill += rowSquares[i].goal.skill;
                }

                // calculate the time difference between the raw time and the desired time
                // so we can factor it out from synergy
                var timeDifference = (65 * bingoGenerator.timePerDifficulty + bingoGenerator.baselineTime) - rowRawTime;

                // adjust the calculated rowSynergy to not include the time difference since that's already
                // accounted for in rowRawTime
                rowSynergy = rowSynergy - timeDifference;

                var rowEffectiveTime = rowRawTime - rowSynergy;
                var rowPerfectTime = rowEffectiveTime - rowSkill;

                var rowCell = '<td class="centered">' + row + "</td>";
                var rawTimeCell = '<td class="raw-time-cell centered">' + rowRawTime + "</td>";
                var synergyCell = '<td class="synergy-cell centered">' + rowSynergy + "</td>";
                var rowEffTimeCell = '<td class="effective-time-cell centered">' + rowEffectiveTime + "</td>";
                var skillCell = '<td class="skill-cell centered">' + rowSkill + '</td>';
                var perfectCell = '<td class="perfect-cell centered">' + rowPerfectTime + '</td>';
                $rowInfoTable.find(".debug-" + row).html(rowCell + rawTimeCell + synergyCell + rowEffTimeCell + skillCell + perfectCell);

                var effectiveTypes = bingoGenerator.getEffectiveTypeSynergiesForRow(row);
                // clean out the 0 values for selfsynergy
                if (effectiveTypes[0]["selfsynergy"] !== undefined) {
                    effectiveTypes[0]["selfsynergy"] = effectiveTypes[0]["selfsynergy"].filter(function (el) {
                        return el != 0;
                    });
                    if (effectiveTypes[0]["selfsynergy"].length === 0) {
                        delete effectiveTypes[0]["selfsynergy"];
                    }
                }
                var typesJson = JSON.stringify(effectiveTypes);

                var rowHtml = '<div><span class="debug-type-row">' + row + ":</span>" + typesJson + "</div>";
                $rowSynergyTable.find(".debug-" + row).html(rowHtml);
            }

            var $synergyCells = $rowInfoTable.find(".synergy-cell");
            colorizeColumns($synergyCells);

            var $rawTimeCells = $rowInfoTable.find(".raw-time-cell");
            colorizeColumns($rawTimeCells, 1, true);

            var $effTimeCells = $rowInfoTable.find(".effective-time-cell");
            colorizeColumns($effTimeCells, 0.1, true);

            var $skillCells = $rowInfoTable.find(".skill-cell");
            colorizeColumns($skillCells, 0.1, true);

            var $perfectCells = $rowInfoTable.find(".perfect-cell");
            colorizeColumns($perfectCells, 0.1, true);
        }

        function colorizeColumns($columns, offset, reversed) {
            if (!offset) {
                offset = 0;
            }

            var values = $columns.map(function () {
                return +$(this).text();
            }).toArray();
            var min = Math.min.apply(null, values) - offset;
            var max = Math.max.apply(null, values) + offset;
            var delta = max - min;

            $columns.each(function () {
                var value = +$(this).text();
                var fraction = (value - min) / delta;
                if (reversed) {
                    fraction = 1 - fraction;
                }
                $(this).css("color", generateColor(fraction));
            });

        }

        function generateColor(fraction) {
            var hue = 120 * fraction;
            return "hsl(" + hue + ", 50%, 50%)";
        }

    }
}

$(bingosetup);
